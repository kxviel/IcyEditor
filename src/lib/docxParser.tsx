import { Paragraph, TextRun, HeadingLevel, FileChild } from "docx";
import { Fieldtype } from "@/store/useQuestionBuilderStore";

export const generateDocFromFields = (
  fields: Fieldtype,
  currentFontSize: number,
) => {
  // Create an array to hold all the paragraphs
  const paragraphs: FileChild[] = [];

  // Iterate through each field (category)
  Array.from(fields.values()).forEach((field) => {
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
    field.questions.forEach((question) => {
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
            // Process the questionText to handle the HTML content
            ...processQuestionText(question.questionText, currentFontSize),
          ],
        }),
      );
    });

    // Add a blank paragraph after each category for spacing
    paragraphs.push(new Paragraph({}));
  });

  // Create and return the document
  return paragraphs;
};

// Helper function to process question text and handle HTML content
const processQuestionText = (htmlText: string, currentFontSize: any) => {
  // Array to store text runs
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

  // Remove HTML tags and handle specific formatting
  const cleanText = htmlText
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

    // Add the question part with formatting
    const questionRuns = parseTextWithFormatting(questionPart.trim());
    textRuns.push(...questionRuns);

    // Split options part by "b." to get both options
    const [optionA, optionB] = ("a." + optionsPart).split(/b\./);

    // Add option A with formatting
    const optionARuns = parseTextWithFormatting("\n" + optionA.trim());
    textRuns.push(...optionARuns);

    // Add option B with formatting
    if (optionB) {
      const optionBRuns = parseTextWithFormatting("\nb." + optionB.trim());
      textRuns.push(...optionBRuns);
    }
  } else {
    // No options, just add the clean text with formatting
    const formattedRuns = parseTextWithFormatting(cleanText.trim());
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
