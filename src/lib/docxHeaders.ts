import { IPatch, PatchType, TextRun } from "docx";

export const docxHeaderOne = (
  headerData: any,
  fontSize: any,
): Record<string, IPatch> => ({
  school_name: {
    type: PatchType.PARAGRAPH,
    children: [
      new TextRun({
        text: headerData.schoolName.value,
        bold: true,
        size: (30 + Number(fontSize)) * 2,
        color: "#345852",
      }),
    ],
  },
  examination_type: {
    type: PatchType.PARAGRAPH,
    children: [
      new TextRun({
        text: headerData.examName.value,
        bold: true,
        size: (16 + Number(fontSize)) * 2,
        color: "#4e8b1a",
      }),
    ],
  },
  duration: {
    type: PatchType.PARAGRAPH,
    children: [
      new TextRun({
        text: `Duration: ${headerData.duration.value}`,
        bold: true,
        size: (14 + Number(fontSize)) * 2,
      }),
    ],
  },
  subject: {
    type: PatchType.PARAGRAPH,
    children: [
      new TextRun({
        text: headerData.subjectName.value,
        bold: true,
        size: (16 + Number(fontSize)) * 2,
        color: "#4e8b1a",
      }),
    ],
  },
  marks: {
    type: PatchType.PARAGRAPH,
    children: [
      new TextRun({
        text: `Marks: ${headerData.totalMarks.value}`,
        bold: true,
        size: (14 + Number(fontSize)) * 2,
      }),
    ],
  },
  class_number: {
    type: PatchType.PARAGRAPH,
    children: [
      new TextRun({
        text: `Marks: ${headerData.classNumber}`,
        bold: true,
        size: (14 + Number(fontSize)) * 2,
      }),
    ],
  },
});

export const docxHeaderTwo = (
  headerData: any,
  fontSize: any,
): Record<string, IPatch> => ({
  school_name: {
    type: PatchType.PARAGRAPH,
    children: [
      new TextRun({
        text: headerData.schoolName.value,
        bold: true,
        size: (30 + Number(fontSize)) * 2,
      }),
    ],
  },
  examination_type: {
    type: PatchType.PARAGRAPH,
    children: [
      new TextRun({
        text: headerData.examName.value,
        bold: true,
        size: (16 + Number(fontSize)) * 2,
      }),
    ],
  },
  duration: {
    type: PatchType.PARAGRAPH,
    children: [
      new TextRun({
        text: `Duration: ${headerData.duration.value}`,
        bold: true,
        size: (14 + Number(fontSize)) * 2,
      }),
    ],
  },
  subject: {
    type: PatchType.PARAGRAPH,
    children: [
      new TextRun({
        text: headerData.subjectName.value,
        bold: true,
        size: (16 + Number(fontSize)) * 2,
      }),
    ],
  },
  marks: {
    type: PatchType.PARAGRAPH,
    children: [
      new TextRun({
        text: `Marks: ${headerData.totalMarks.value}`,
        bold: true,
        size: (14 + Number(fontSize)) * 2,
      }),
    ],
  },
});

export const docxHeaderFour = (
  headerData: any,
  fontSize: any,
): Record<string, IPatch> => ({
  school_name: {
    type: PatchType.PARAGRAPH,
    children: [
      new TextRun({
        text: headerData.schoolName.value,
        bold: true,
        size: (26 + Number(fontSize)) * 2,
      }),
    ],
  },
  examination_type: {
    type: PatchType.PARAGRAPH,
    children: [
      new TextRun({
        text: headerData.examName.value,
        bold: true,
        size: (16 + Number(fontSize)) * 2,
      }),
    ],
  },
  duration: {
    type: PatchType.PARAGRAPH,
    children: [
      new TextRun({
        text: `Duration: ${headerData.duration.value}`,
        bold: true,
        size: (14 + Number(fontSize)) * 2,
      }),
    ],
  },
  subject: {
    type: PatchType.PARAGRAPH,
    children: [
      new TextRun({
        text: headerData.subjectName.value,
        bold: true,
        size: (14 + Number(fontSize)) * 2,
      }),
    ],
  },
  marks: {
    type: PatchType.PARAGRAPH,
    children: [
      new TextRun({
        text: `Marks: ${headerData.totalMarks.value}`,
        bold: true,
        size: (14 + Number(fontSize)) * 2,
      }),
    ],
  },
});
