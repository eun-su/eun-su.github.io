import HomeContactSection from "./HomeContactSection";
import HomeCoverSection from "./HomeCoverSection";
import HomeDesignSection from "./HomeDesignSection";
import HomeIntroSection from "./HomeIntroSection";
import HomePortfolioSection from "./HomePortfolioSection";
import HomeProjectCardsSection from "./HomeProjectCardsSection";
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
  switch (section.mode) {
    case "cover":
      return <HomeCoverSection section={section} isActive={true} />;

    case "intro":
      return <HomeIntroSection section={section} />;

    case "cards":
      return (
        <HomeProjectCardsSection
          section={section}
          cards={cards}
          currentProjectCard={currentProjectCard}
          projectTrackRef={projectTrackRef}
        />
      );

    case "design":
      return <HomeDesignSection section={section} onLinkClick={onCtaClick} />;

    case "marketing":
      return <HomePortfolioSection section={section} onLinkClick={onCtaClick} />;

    case "contact":
      return <HomeContactSection section={section} />;

    default:
      return null;
  }
}
