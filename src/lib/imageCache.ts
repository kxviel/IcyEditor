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

      // Create a hidden iframe to load the image in a different context
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.sandbox.add('allow-same-origin');
      document.body.appendChild(iframe);

      const imageBuffer = await new Promise<ArrayBuffer | null>((resolve) => {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) {
          resolve(null);
          return;
        }

        const img = iframeDoc.createElement('img');
        
        img.onload = () => {
          try {
            const canvas = iframeDoc.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(null);
              return;
            }

            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob(async (blob) => {
              if (blob) {
                const buffer = await blob.arrayBuffer();
                await this.storeImage(imageUrl, buffer);
                resolve(buffer);
              } else {
                resolve(null);
              }
            }, 'image/png', 0.8);
          } catch (error) {
            console.error('Canvas processing failed:', error);
            resolve(null);
          }
        };

        img.onerror = () => {
          console.error('Image failed to load in iframe:', imageUrl);
          resolve(null);
        };

        // Set src to trigger loading
        img.src = imageUrl;
        
        // Timeout
        setTimeout(() => {
          console.warn('Image loading timeout in iframe:', imageUrl);
          resolve(null);
        }, 15000);
      });

      // Cleanup iframe
      document.body.removeChild(iframe);
      return imageBuffer;

    } catch (error) {
      console.error('Image caching failed:', error);
      return null;
    }
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
}

export const imageCache = new ImageCache();