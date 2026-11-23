import type { ImageMetadata } from "astro";
import viewOfAmsterdam from "../assets/contact/view-of-amsterdam.png";

/**
 * The print at the foot of the contact sheet. To hang another one, change this entry.
 *
 * The file must be black lines on pure white, cut to the picture with no margin:
 * white takes the colour of the sheet, so only the lines are printed on it.
 * This one is the museum's open-access scan (CC0), cut to the etched lines below
 * the sky, with the paper cleaned to white.
 */
export interface Print {
  image: ImageMetadata;
  artist: string;
  title: string;
  date: string;
  medium: string;
  collection: string;
  /** The museum's page for the work. */
  href: string;
  alt: string;
  /** The point across the picture that stays in view when a narrow screen crops its sides. */
  focus: string;
}

export const print: Print = {
  image: viewOfAmsterdam,
  artist: "Rembrandt van Rijn",
  title: "View of Amsterdam from the North West",
  date: "c.\u00a01640",
  medium: "Etching",
  collection: "The Cleveland Museum of Art",
  href: "https://clevelandart.org/art/1963.84",
  alt: "An etching of Amsterdam seen across flat fields: a windmill, church spires and the masts of ships along the horizon, with reeds in the foreground.",
  focus: "54%",
};
