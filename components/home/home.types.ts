export type HomeSectionMode =
  | "cover"
  | "intro"
  | "cards"
  | "design"
  | "marketing"
  | "contact";

export type MainSection = {
  id: string;
  indexLabel: string;
  eyebrow: string;
  title: string;
  desc: string;
  mode: HomeSectionMode;
  highlight?: string;
  tags?: string[];
  bullets?: string[];
  stats?: Array<{ label: string; value: string }>;
  links?: Array<{ label: string; href: string }>;
};

export type ProjectCard = {
  step: string;
  category: string;
  title: string;
  desc: string;
  meta: string[];
  imageSrc?: string;
  imageAlt?: string;
  ctaLabel?: string;
  ctaHref?: string;
};
