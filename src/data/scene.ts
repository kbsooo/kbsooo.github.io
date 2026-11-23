/**
 * The moving scene at the foot of the contact sheet: one piece of the
 * ascii-magic-art library (src/vendor/ascii-magic-art), drawn on the sheet in
 * one ink as halftone dots.
 *
 * To show another piece, copy its file into the vendor folder, import it in
 * ContactScene.astro and change this entry.
 */
export const scene = {
  /** Who made the piece, as the library's licence names them. */
  maker: "ASCII Magic",
  name: "Viaduct Steam Train",
  library: "ascii-magic-art",
  /** The piece's page in the library. */
  href: "https://www.ascii-magic.com/ascii/viaduct-steam-train",
  /** The library's licence, served by this site (src/pages/licenses/). */
  licence: "/licenses/ascii-magic-art.txt",
  alt: "A steam train crossing a tall stone viaduct in the mountains, drawn in halftone dots.",
  /** The piece's grid, in cells. */
  cols: 192,
  rows: 108,
  /** The point across the scene, from 0 to 1, that stays in view when an upright screen crops its sides. */
  focus: 0.45,
  /** The height in the scene, from 0 at its top to 1, that stays in view when a low window crops it: the deck of the bridge. */
  level: 0.5,
  /** The moment, in seconds, the scene starts from: the train is on the bridge. */
  start: 1.25,
};
