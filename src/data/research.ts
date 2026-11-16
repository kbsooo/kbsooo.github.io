export interface ResearchFile {
  /** Link text, e.g. "Paper (PDF)", "Slides (PDF)", "arXiv". */
  label: string;
  /** A file in public/ (e.g. "/research/my-paper.pdf") or an external URL. */
  href: string;
}

export interface ResearchItem {
  /**
   * The entry's anchor on the Research page, and the folder under
   * src/assets/research/ that holds its plates:
   *   <slug>/slides/01.webp ...   one image per slide
   *   <slug>/figures/1.webp ...   named after the figure ("2a" shows as "Fig. 2a")
   *   <slug>/pages/1.webp ...     one image per page of the paper
   * Every folder is optional; an entry without images shows text only.
   */
  slug: string;
  title: string;
  /** The title in the paper's own language, when the paper is not in English. */
  originalTitle?: { text: string; lang: string };
  /** Used for sorting, and shown when there is no venue. */
  year: number;
  /** Short name of where it appeared, year included: "CISC-W'26", "arXiv 2026", ... */
  venue?: string;
  /** The full line for the Research page: event, place, date, kind of presentation. */
  event?: string;
  authors?: string;
  summary?: string;
  files: ResearchFile[];
}

// Put attachments in public/research/ and link them as "/research/<file name>".
// Pages sort by year, newest first; within a year the order here is kept.
const entries: ResearchItem[] = [
  {
    slug: "lora-poisoned-sample-ranking",
    title: "Post-hoc Ranking of Poisoned Training Samples in LoRA-Fine-Tuned Models",
    originalTitle: {
      text: "LoRA 기반 파인튜닝 모델의 오염 학습 샘플 사후 순위화 기법",
      lang: "ko",
    },
    year: 2026,
    venue: "CISC-W'26",
    event:
      "Conference on Information Security and Cryptography Winter 2026 (CISC-W'26), " +
      "Yeosu, Korea, October 2026. Oral presentation.",
    authors: "Byungsoo Kang, Minseok Kim, Hyungjoon Koo",
    summary:
      "Ranks the training samples of a LoRA-fine-tuned model by suspicion of poisoning. " +
      "The principal direction of the adapter's weight update is taken by singular value decomposition, " +
      "and each sample is scored by projecting the hidden representation of its instruction onto that direction, " +
      "with one forward pass per sample and no additional training or backpropagation. " +
      "Across 18 settings built from Qwen3-1.7B and BackdoorLLM, the method reached a mean AUROC of 0.857 " +
      "and a mean average precision of 0.498, higher on average than the reimplemented baselines " +
      "(Spectral Signatures, SPECTRE, and LoRAScan).",
    files: [
      { label: "Paper (PDF, Korean)", href: "/research/lora-poisoned-sample-ranking.pdf" },
      { label: "Slides (PDF)", href: "/research/lora-poisoned-sample-ranking-slides.pdf" },
    ],
  },
  {
    slug: "hs-jepa",
    title: "HS-JEPA: A JEPA-Inspired Predictive Multi-View Framework for Human Life Logs",
    year: 2026,
    venue: "ICTC 2026 Workshop",
    event:
      "Workshop on ETRI Human Understanding AI Paper Challenge (IWETRIAI), " +
      "ICTC 2026, Jeju, Korea, October 2026. Poster.",
    authors: "Byungsoo Kang, Gwang-Min Park, DongKyu Hyeon (equal contribution)",
    summary:
      "A prototype that organizes each subject-day of smartphone and wearable life logs into nine " +
      "label-agnostic semantic views, masks one view, and asks how much of it the rest of the day can explain. " +
      "Each target is decomposed into a prediction, a residual unexplained by the fitted predictor, " +
      "and its magnitude (surprise energy). The decomposition is presented as an exploratory analytical " +
      "framework, not a claim of superior label prediction.",
    files: [{ label: "Paper (PDF)", href: "/research/hs-jepa.pdf" }],
  },
];

// Red is kept for the contact sheet and yellow for the activity sheet.
const tones = ["blue", "green", "purple", "orange", "brown"] as const;

/**
 * Newest first. `no` counts the works in the order they were written, and
 * `tone` is the colour of the sheet a work hangs on; it follows `no`, so a
 * work keeps its colour when newer ones are added.
 */
export const research = [...entries]
  .sort((a, b) => b.year - a.year)
  .map((item, index, sorted) => {
    const no = sorted.length - index;
    return { ...item, no, tone: tones[(no - 1) % tones.length] };
  });

/** The short venue, or just the year when no venue is known. */
export function venueLine(item: ResearchItem) {
  return item.venue ?? String(item.year);
}
