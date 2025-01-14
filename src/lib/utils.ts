import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const series = [
  "Blackberry",
  "Blueray",
  "Click",
  "Monopoly",
  "Eduplan",
  "Grand",
  "Keylinks",
  "Vista",
  "Ultimate",
  "Splendid",
  "Happigo",
  "Saarthi",
  "Jumbo-Combo",
];

export const publicationList = [
  {
    name: "Blueray Publication",
    parentValue: "1",
  },
  {
    name: "Monopoly Publication",
    parentValue: "2",
  },
  {
    name: "Blackberry Publication",
    parentValue: "3",
  },
  {
    name: "Splendid Educational Books",
    parentValue: "4",
  },
  {
    name: "Vista Edu Hub",
    parentValue: "5",
  },
  {
    name: "Eduplan Learning",
    parentValue: "6",
  },
  {
    name: "Happigo",
    parentValue: "7",
  },
  {
    name: "SMILEY",
    parentValue: "8",
  },
];
