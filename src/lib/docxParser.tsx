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
  // return new Document({
  //   sections: [
  //     {
  //       properties: {},
  //       children: paragraphs,
  //     },
  //   ],
  // });
};

// Helper function to process question text and handle HTML content
const processQuestionText = (htmlText: string, currentFontSize: any) => {
  // Array to store text runs
  const textRuns = [];

  // Remove HTML tags and handle specific formatting
  const cleanText = htmlText
    .replace(/<\/?p>/g, "") // Remove p tags
    .replace(/&nbsp;/g, " "); // Replace non-breaking spaces

  // Check if there are options (a. and b.)
  if (cleanText.includes("a.") && cleanText.includes("b.")) {
    // Split at the first occurrence of "a."
    const [questionPart, optionsPart] = cleanText.split(/a\./);

    // Add the question part
    textRuns.push(
      new TextRun({
        text: questionPart.trim(),
        size: (14 + Number(currentFontSize)) * 2,
      }),
    );

    // Split options part by "b." to get both options
    const [optionA, optionB] = ("a." + optionsPart).split(/b\./);

    // Add option A
    textRuns.push(
      new TextRun({
        text: "\n" + optionA.trim(),
        size: (14 + Number(currentFontSize)) * 2,
      }),
    );

    // Add option B
    textRuns.push(
      new TextRun({
        text: "\nb." + optionB.trim(),
        size: (14 + Number(currentFontSize)) * 2,
      }),
    );
  } else {
    // No options, just add the clean text
    textRuns.push(
      new TextRun({
        text: cleanText.trim(),
        size: (14 + Number(currentFontSize)) * 2,
      }),
    );
  }

  return textRuns;
};
