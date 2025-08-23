import http from '@/config/https';

// Temporary image cache using IndexedDB for DOCX generation
class ImageCache {
  private dbName = 'DocxImageCache';
  private storeName = 'images';
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'url' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async cacheImage(imageUrl: string): Promise<ArrayBuffer | null> {
    try {
      console.log('Attempting to cache image:', imageUrl);
      
      // Try to get from cache first
      const cached = await this.getCachedImage(imageUrl);
      if (cached) {
        console.log('Using cached image:', imageUrl);
        return cached;
      }

      // Download S3 image and convert to data URL asset
      console.log('Downloading S3 image and converting to asset:', imageUrl);
      const imageBuffer = await this.fetchViaProxy(imageUrl);
      if (imageBuffer) {
        await this.storeImage(imageUrl, imageBuffer);
        return imageBuffer;
      }

      console.warn('Failed to fetch image via proxy:', imageUrl);
      return null;

    } catch (error) {
      console.error('Image caching failed:', error);
      return null;
    }
  }

  private async fetchViaProxy(imageUrl: string): Promise<ArrayBuffer | null> {
    try {
      console.log('Downloading S3 image and converting to data URL:', imageUrl);
      
      // Step 1: Download the image using your http config
      const response = await http.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 15000,
      });
      
      if (response.status === 200 && response.data) {
        console.log('Downloaded image from S3, size:', response.data.byteLength);
        
        // Step 2: Convert ArrayBuffer to Blob
        const imageBlob = new Blob([response.data], { 
          type: response.headers['content-type'] || 'image/png' 
        });
        
        // Step 3: Convert Blob to data URL (base64)
        const dataUrl = await this.blobToDataURL(imageBlob);
        console.log('Converted to data URL:', dataUrl.substring(0, 50) + '...');
        
        // Step 4: Create ArrayBuffer from data URL (like using a local asset)
        const imageBuffer = await this.dataURLToBuffer(dataUrl);
        
        if (imageBuffer) {
          console.log('Successfully created buffer from data URL, size:', imageBuffer.byteLength);
          return imageBuffer;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Direct S3 download failed:', error);
      return null;
    }
  }

  private async blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  private async dataURLToBuffer(dataUrl: string): Promise<ArrayBuffer | null> {
    return new Promise((resolve) => {
      try {
        // Create image from data URL (works like a local asset - no CORS issues!)
        const img = new Image();
        
        img.onload = () => {
          try {
            // Create canvas and draw the data URL image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              resolve(null);
              return;
            }

            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            
            // This should work without CORS issues since it's a data URL!
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob(async (blob) => {
              if (blob) {
                const buffer = await blob.arrayBuffer();
                resolve(buffer);
              } else {
                resolve(null);
              }
            }, 'image/png', 0.9);
            
          } catch (canvasError) {
            console.error('Canvas processing failed:', canvasError);
            resolve(null);
          }
        };
        
        img.onerror = () => {
          console.error('Data URL image failed to load');
          resolve(null);
        };
        
        // Set timeout
        setTimeout(() => {
          console.warn('Data URL image loading timeout');
          resolve(null);
        }, 10000);
        
        // Set the data URL as src (works like a local asset!)
        img.src = dataUrl;
        
      } catch (error) {
        console.error('Error in dataURLToBuffer:', error);
        resolve(null);
      }
    });
  }

  private async getCachedImage(imageUrl: string): Promise<ArrayBuffer | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve) => {
      if (!this.db) {
        resolve(null);
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(imageUrl);
      
      request.onsuccess = () => {
        const result = request.result;
        if (result && Date.now() - result.timestamp < 24 * 60 * 60 * 1000) { // 24 hours
          resolve(result.buffer);
        } else {
          resolve(null);
        }
      };
      
      request.onerror = () => resolve(null);
    });
  }

  private async storeImage(imageUrl: string, buffer: ArrayBuffer): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve) => {
      if (!this.db) {
        resolve();
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      store.put({
        url: imageUrl,
        buffer: buffer,
        timestamp: Date.now()
      });
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => resolve(); // Fail silently
    });
  }

  async clearOldImages(): Promise<void> {
    if (!this.db) await this.init();
    
    if (!this.db) return;

    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    const index = store.index('timestamp');
    
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
    const range = IDBKeyRange.upperBound(cutoffTime);
    
    const request = index.openCursor(range);
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
  }

  async clearAllImages(): Promise<void> {
    if (!this.db) await this.init();
    
    if (!this.db) return;

    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    store.clear();
  }

  // Get cached image as blob URL for HTML display
  async getCachedImageAsObjectURL(imageUrl: string): Promise<string | null> {
    try {
      const cached = await this.getCachedImage(imageUrl);
      if (cached) {
        const blob = new Blob([cached], { type: 'image/png' });
        return URL.createObjectURL(blob);
      }

      // If not cached, fetch and cache it
      const buffer = await this.cacheImage(imageUrl);
      if (buffer) {
        const blob = new Blob([buffer], { type: 'image/png' });
        return URL.createObjectURL(blob);
      }

      return null;
    } catch (error) {
      console.error('Failed to get cached image as object URL:', error);
      return null;
    }
  }
}

export const imageCache = new ImageCache();