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

export const publication = [
  "Blackberry Publication",
  "Blueray Publication",
  "Monopoly Publication",
  "Eduplan Learning",
  "Keylinks",
  "Vista Edu Hub",
  "Splendid Educational Books",
  "Happigo",
  "SMILEY",
];
