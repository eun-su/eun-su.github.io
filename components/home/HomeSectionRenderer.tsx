import HomeHeroSection from "./HomeHeroSection";
import HomeProjectCardsSection from "./HomeProjectCardsSection";
import HomeTextSection from "./HomeTextSection";
import type { MainSection, ProjectCard } from "./home.types";

type HomeSectionRendererProps = {
  section: MainSection;
  cards: ProjectCard[];
  currentProjectCard: number;
  projectTrackRef: React.RefObject<HTMLDivElement | null>;
  onCtaClick?: (href?: string) => void;
};

export default function HomeSectionRenderer({
  section,
  cards,
  currentProjectCard,
  projectTrackRef,
  onCtaClick,
}: HomeSectionRendererProps) {
  if (section.mode === "hero") {
    return <HomeHeroSection section={section} onCtaClick={onCtaClick} />;
  }

  if (section.mode === "cards") {
    return (
      <HomeProjectCardsSection
        section={section}
        cards={cards}
        currentProjectCard={currentProjectCard}
        projectTrackRef={projectTrackRef}
      />
    );
  }

  return <HomeTextSection section={section} onCtaClick={onCtaClick} />;
}