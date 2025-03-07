import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";
import { Fieldtype } from "@/store/useQuestionBuilderStore";
import { HeaderItem } from "@/store/useHeaderStore";

export const generateDocFromFields = (
  fields: Fieldtype,
  currentFontSize: number,
  headerData: Record<string, HeaderItem>,
) => {
  // Create an array to hold all the paragraphs
  const paragraphs: any = [];

  // Iterate through each field (category)
  Array.from(fields.values()).forEach((field) => {
    // Add the category title paragraph
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
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
  return new Document({
    sections: [
      {
        properties: {},
        children: [
          // // School Name - Centered & Bold
          // new Paragraph({
          //   children: [
          //     new TextRun({
          //       text: "SCHOOL NAME",
          //       bold: true,
          //       size: 48,
          //       font: "Times New Roman",
          //     }),
          //   ],
          //   alignment: "center",
          // }),

          // // Examination Type & Subject
          // new Paragraph({
          //   children: [
          //     new TextRun({
          //       text: "EXAMINATION TYPE",
          //       bold: true,
          //       size: 32,
          //       color: "4F772D", // Dark Green
          //       font: "Times New Roman",
          //     }),
          //   ],
          //   alignment: "center",
          // }),

          // new Paragraph({
          //   children: [
          //     new TextRun({
          //       text: "SUBJECT",
          //       bold: true,
          //       size: 32,
          //       color: "4F772D",
          //       font: "Times New Roman",
          //     }),
          //   ],
          //   alignment: "center",
          // }),

          // // Duration and Marks Table
          // new Table({
          //   width: { size: 100, type: WidthType.PERCENTAGE },
          //   rows: [
          //     new TableRow({
          //       children: [
          //         new TableCell({
          //           children: [new Paragraph({ text: "Duration:" })],
          //         }),
          //         new TableCell({
          //           children: [],
          //         }),
          //         new TableCell({
          //           children: [new Paragraph({ text: "Marks:" })],
          //         }),
          //         new TableCell({
          //           children: [],
          //         }),
          //       ],
          //     }),
          //   ],
          // }),

          // new Paragraph({ text: "", spacing: { before: 200, after: 200 } }),

          // // Student Information Table with Green Background
          // new Table({
          //   width: { size: 100, type: WidthType.PERCENTAGE },
          //   rows: [
          //     new TableRow({
          //       children: [
          //         new TableCell({
          //           children: [new Paragraph({ text: "Name:" })],
          //           shading: { fill: "C3E6A3" }, // Light Green Background
          //         }),
          //         new TableCell({
          //           children: [new Paragraph("_____________________")],
          //           shading: { fill: "C3E6A3" },
          //         }),
          //         new TableCell({
          //           children: [new Paragraph({ text: "Class:" })],
          //           shading: { fill: "C3E6A3" },
          //         }),
          //         new TableCell({
          //           children: [new Paragraph("_____________________")],
          //           shading: { fill: "C3E6A3" },
          //         }),
          //         new TableCell({
          //           children: [new Paragraph({ text: "Roll No:" })],
          //           shading: { fill: "C3E6A3" },
          //         }),
          //         new TableCell({
          //           children: [new Paragraph("_____________________")],
          //           shading: { fill: "C3E6A3" },
          //         }),
          //       ],
          //     }),
          //   ],
          // }),
          ...paragraphs,
        ],
      },
    ],
  });
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
