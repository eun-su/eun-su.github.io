export type HomeSectionMode = "hero" | "normal" | "cards";

export type MainSection = {
  id: string;
  indexLabel: string;
  eyebrow: string;
  title: string;
  desc: string;
  meta?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  mode: HomeSectionMode;
};

export type ProjectCard = {
  step: string;
  title: string;
  desc: string;
  meta: string[];
};