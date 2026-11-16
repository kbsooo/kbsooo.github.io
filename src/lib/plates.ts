import type { ImageMetadata } from "astro";

export type SeriesKind = "slides" | "figures" | "pages";

export interface Plate {
  image: ImageMetadata;
  /** "Slide 3", "Fig. 2a", "Page 1" */
  label: string;
}

export interface Series {
  kind: SeriesKind;
  plates: Plate[];
}

const images = import.meta.glob<ImageMetadata>("../assets/research/*/*/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

const kinds: SeriesKind[] = ["slides", "figures", "pages"];
const prefix: Record<SeriesKind, string> = { slides: "Slide", figures: "Fig.", pages: "Page" };

/** The plates of one research entry, grouped by folder: slides, then figures, then pages. */
export function seriesFor(slug: string): Series[] {
  const found = new Map<SeriesKind, { name: string; image: ImageMetadata }[]>();

  for (const [path, image] of Object.entries(images)) {
    const [entry, kind, file] = path.split("/").slice(-3);
    if (entry !== slug || !kinds.includes(kind as SeriesKind)) continue;
    const name = file.replace(/\.[^.]+$/, "").replace(/^0+(?=\d)/, "");
    found.set(kind as SeriesKind, [...(found.get(kind as SeriesKind) ?? []), { name, image }]);
  }

  return kinds
    .filter((kind) => found.has(kind))
    .map((kind) => ({
      kind,
      plates: found
        .get(kind)!
        .sort((a, b) => a.name.localeCompare(b.name, "en", { numeric: true }))
        .map(({ name, image }) => ({ image, label: `${prefix[kind]} ${name}` })),
    }));
}

/** "16 slides, 4 pages" */
export function countLine(series: Series[]) {
  return series
    .map(({ kind, plates }) => `${plates.length} ${plates.length === 1 ? kind.slice(0, -1) : kind}`)
    .join(", ");
}
