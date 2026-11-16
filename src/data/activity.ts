import type { ImageMetadata } from "astro";
import aiTop100 from "../assets/activity/ai-top-100-certificate.webp";
import kaggleSilver from "../assets/activity/kaggle-silver-medal-certificate.jpg";

/** A piece of the line under a title: plain text, or a link. */
type Piece = string | { text: string; href: string };

export interface ActivityItem {
  /** Year and month it began or took place: "2026.07". */
  date: string;
  /** Still going on, so the date is printed open: "2026.07 ~". */
  ongoing?: boolean;
  /** What it is: a role, a degree, a result. */
  title: string;
  /** The line under the title: where it is or who it is from, written in pieces so a part can be a link. */
  detail: Piece[];
  /** A certificate for it, hung beside its line. Images live in src/assets/activity/. */
  certificate?: ImageMetadata;
}

const entries: ActivityItem[] = [
  {
    date: "2026.07",
    ongoing: true,
    title: "Research Intern",
    detail: [{ text: "SecAI Lab", href: "https://secai.skku.edu/" }, ", Sungkyunkwan University"],
  },
  {
    date: "2026.04",
    title: "AI TOP 100 Finalist",
    detail: [
      "Brian Impact and Kakao Impact, ",
      { text: "article by Kakao", href: "https://www.kakaocorp.com/page/detail/11978" },
    ],
    certificate: aiTop100,
  },
  {
    date: "2026.01",
    title: "Kaggle Silver Medal",
    detail: [
      { text: "CSIRO Image2Biomass Prediction", href: "https://www.kaggle.com/competitions/csiro-biomass" },
      ", 181st of 3,802 teams",
    ],
    certificate: kaggleSilver,
  },
  {
    date: "2021.03",
    ongoing: true,
    title: "B.S. in Computer Engineering",
    detail: ["Myongji University"],
  },
];

/** Newest first. */
export const activity = [...entries].sort((a, b) => b.date.localeCompare(a.date));
