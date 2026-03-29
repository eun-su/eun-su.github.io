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
  meta?: string[];
  ctaLabel?: string;
  ctaHref?: string;
};

export type ProjectCard = {
  step: string;
  title: string;
  desc: string;
  meta: string[];
  category?: string;
  imageSrc?: string;
  imageAlt?: string;
  ctaLabel?: string;
  ctaHref?: string;
  siteLabel?: string;
  siteHref?: string;
};