import { Paragraph, TextRun, HeadingLevel, FileChild, ImageRun } from "docx";
import { Fieldtype } from "@/store/useQuestionBuilderStore";
import { imageCache } from "./imageCache";

export const generateDocFromFields = async (
  fields: Fieldtype,
  currentFontSize: number,
) => {
  // Create an array to hold all the paragraphs
  const paragraphs: FileChild[] = [];

  // Iterate through each field (category)
  for (const field of Array.from(fields.values())) {
    // Add the category title paragraph
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        indent: {
          left: 270,
          right: 270,
        },
        spacing: {
          after: 270,
        },
        children: [
          new TextRun({
            text: `Q${field.categoryIndex! + 1}. `,
            bold: true,
            size: (16 + Number(currentFontSize)) * 2, // Convert from px to half-points
          }),
          new TextRun({
            text: field.categoryName,
            bold: true,
            size: (16 + Number(currentFontSize)) * 2,
          }),
          new TextRun({
            text: `  (1 x ${field.questions.length}) = 5`,
            size: (14 + Number(currentFontSize)) * 2,
          }),
        ],
      }),
    );

    // Add each question
    for (const question of field.questions) {
      // Process the questionText to handle the HTML content with images
      const questionContent = await processQuestionText(question.questionText, currentFontSize);
      
      // Create a paragraph for each question
      paragraphs.push(
        new Paragraph({
          indent: {
            left: 270,
            right: 270,
          },
          children: [
            new TextRun({
              text: `${question.questionIndex! + 1}. `,
              bold: true,
              size: (14 + Number(currentFontSize)) * 2,
            }),
            // Add the processed question content (text and images)
            ...questionContent,
          ],
        }),
      );
    }

    // Add a blank paragraph after each category for spacing
    paragraphs.push(new Paragraph({}));
  }

  // Create and return the document
  return paragraphs;
};

// Helper function to process question text and handle HTML content
const processQuestionText = async (htmlText: string, currentFontSize: any) => {
  // Array to store text runs and images
  const textRuns = [];

  // Simple function to parse nested tags and create text runs
  const parseTextWithFormatting = (text: string) => {
    const runs = [];
    const currentText = text;

    // First handle heading tags (h1, h2, h3) - they get priority
    const headingRegex = /<\/?h([1-3])>/gi;
    const headingParts = currentText.split(headingRegex);

    for (let i = 0; i < headingParts.length; i += 2) {
      const textPart = headingParts[i];
      const headingLevel = headingParts[i + 1];

      if (textPart && textPart.trim()) {
        // Determine if this is a heading and what level
        const isHeading =
          headingLevel && ["1", "2", "3"].includes(headingLevel);
        let fontSize = (14 + Number(currentFontSize)) * 2;
        let isBold = false;

        if (isHeading) {
          // Adjust font size based on heading level
          const sizeMultiplier =
            headingLevel === "1" ? 1.5 : headingLevel === "2" ? 1.3 : 1.1;
          fontSize = Math.round(fontSize * sizeMultiplier);
          isBold = true;
        }

        // Handle bold tags within this part
        const boldRegex = /<\/?(?:b|strong)>/gi;
        const boldParts = textPart.split(boldRegex);

        for (let j = 0; j < boldParts.length; j++) {
          if (boldParts[j].trim()) {
            // Check if this part should be bold (odd indices after split, or if it's a heading)
            const shouldBeBold = isBold || j % 2 === 1;

            // Handle italic within this part
            const italicRegex = /<\/?(?:i|em)>/gi;
            const italicParts = boldParts[j].split(italicRegex);

            for (let k = 0; k < italicParts.length; k++) {
              if (italicParts[k].trim()) {
                const isItalic = k % 2 === 1;

                runs.push(
                  new TextRun({
                    text: italicParts[k],
                    size: fontSize,
                    bold: shouldBeBold,
                    italics: isItalic,
                  }),
                );
              }
            }
          }
        }
      }
    }

    return runs;
  };

  // Function to fetch image and create ImageRun using cache
  const createImageRun = async (imageUrl: string) => {
    try {
      console.log('DOCX: Attempting to load image with cache:', imageUrl);
      
      // Use image cache to get the image buffer
      const imageBuffer = await imageCache.cacheImage(imageUrl);
      
      if (imageBuffer && imageBuffer.byteLength > 0) {
        console.log('DOCX: Successfully loaded image from cache, size:', imageBuffer.byteLength);
        
        // Validate that we have a reasonable image buffer size
        if (imageBuffer.byteLength < 100) {
          console.warn('DOCX: Image buffer too small, likely corrupted:', imageUrl);
          return new TextRun({
            text: `[Image too small: ${imageUrl.split('/').pop()?.split('?')[0] || 'unknown'}]`,
            size: (14 + Number(currentFontSize)) * 2,
            color: "999999",
          });
        }

        // Check for valid image file signatures (magic bytes)
        const uint8Array = new Uint8Array(imageBuffer.slice(0, 8));
        const isPNG = uint8Array[0] === 0x89 && uint8Array[1] === 0x50 && uint8Array[2] === 0x4E && uint8Array[3] === 0x47;
        const isJPEG = uint8Array[0] === 0xFF && uint8Array[1] === 0xD8;
        
        if (!isPNG && !isJPEG) {
          console.warn('DOCX: Image buffer has invalid signature, possibly corrupted:', imageUrl);
          return new TextRun({
            text: `[Invalid image format: ${imageUrl.split('/').pop()?.split('?')[0] || 'unknown'}]`,
            size: (14 + Number(currentFontSize)) * 2,
            color: "999999",
          });
        }

        try {
          return new ImageRun({
            data: imageBuffer,
            transformation: {
              width: 300, // Reasonable width in pixels
              height: 200, // Reasonable height in pixels
            },
          });
        } catch (imageRunError) {
          console.error('DOCX: Failed to create ImageRun:', imageRunError);
          return new TextRun({
            text: `[Image processing error: ${imageUrl.split('/').pop()?.split('?')[0] || 'unknown'}]`,
            size: (14 + Number(currentFontSize)) * 2,
            color: "999999",
          });
        }
      } else {
        console.warn('DOCX: Failed to load image, using placeholder:', imageUrl);
        return new TextRun({
          text: `[Image unavailable: ${imageUrl.split('/').pop()?.split('?')[0] || 'unknown'}]`,
          size: (14 + Number(currentFontSize)) * 2,
          color: "999999",
        });
      }
    } catch (error) {
      console.error('DOCX: Image loading error:', imageUrl, error);
      return new TextRun({
        text: `[Image error: ${imageUrl.split('/').pop()?.split('?')[0] || 'unknown'}]`,
        size: (14 + Number(currentFontSize)) * 2,
        color: "999999",
      });
    }
  };

  // Function to parse text and replace image placeholders with actual images
  const parseTextWithImages = async (text: string) => {
    const runs = [];
    const parts = text.split(/(\[IMAGE_\d+\])/);
    
    for (const part of parts) {
      const imageMatch = part.match(/\[IMAGE_(\d+)\]/);
      if (imageMatch) {
        const imageIndex = parseInt(imageMatch[1]);
        if (imageMatches[imageIndex]) {
          const imageRun = await createImageRun(imageMatches[imageIndex]);
          runs.push(imageRun);
        }
      } else if (part.trim()) {
        const formattedRuns = parseTextWithFormatting(part);
        runs.push(...formattedRuns);
      }
    }
    
    return runs;
  };

  // Extract images first and replace with placeholders
  const imageRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
  const imageMatches = [];
  let match;
  let textWithImagePlaceholders = htmlText;

  // Find all images and create placeholders
  while ((match = imageRegex.exec(htmlText)) !== null) {
    const imageUrl = match[1];
    const placeholder = `[IMAGE_${imageMatches.length}]`;
    imageMatches.push(imageUrl);
    textWithImagePlaceholders = textWithImagePlaceholders.replace(match[0], placeholder);
  }

  // Remove HTML tags and handle specific formatting
  const cleanText = textWithImagePlaceholders
    .replace(/<\/?p>/g, "") // Remove p tags
    .replace(/<br\s*\/?>/gi, "\n") // Convert br tags to newlines
    .replace(/&nbsp;/g, " ") // Replace non-breaking spaces
    .replace(/&amp;/g, "&") // Replace HTML entities
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');

  // Check if there are options (a. and b.)
  if (cleanText.includes("a.") && cleanText.includes("b.")) {
    // Split at the first occurrence of "a."
    const [questionPart, optionsPart] = cleanText.split(/a\./);

    // Add the question part with formatting and images
    const questionRuns = await parseTextWithImages(questionPart.trim());
    textRuns.push(...questionRuns);

    // Split options part by "b." to get both options
    const [optionA, optionB] = ("a." + optionsPart).split(/b\./);

    // Add option A with formatting and images
    const optionARuns = await parseTextWithImages("\n" + optionA.trim());
    textRuns.push(...optionARuns);

    // Add option B with formatting and images
    if (optionB) {
      const optionBRuns = await parseTextWithImages("\nb." + optionB.trim());
      textRuns.push(...optionBRuns);
    }
  } else {
    // No options, just add the clean text with formatting and images
    const formattedRuns = await parseTextWithImages(cleanText.trim());
    textRuns.push(...formattedRuns);
  }

  // Fallback: if no runs were created, add plain text
  if (textRuns.length === 0) {
    textRuns.push(
      new TextRun({
        text: cleanText.trim() || htmlText.trim(),
        size: (14 + Number(currentFontSize)) * 2,
      }),
    );
  }

  return textRuns;
};
