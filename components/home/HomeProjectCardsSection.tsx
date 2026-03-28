import type { RefObject } from "react";
import type { MainSection, ProjectCard } from "./home.types";
import styles from "./HomeProjectCardsSection.module.scss";

type HomeProjectCardsSectionProps = {
  section: MainSection;
  cards: ProjectCard[];
  currentProjectCard: number;
  projectTrackRef: RefObject<HTMLDivElement | null>;
  onCtaClick?: (href?: string) => void;
};

export default function HomeProjectCardsSection({
  section,
  cards,
  currentProjectCard,
  projectTrackRef,
  onCtaClick,
}: HomeProjectCardsSectionProps) {
  const handleLinkClick = (href?: string) => {
    if (!href) {
      return;
    }

    if (/^https?:\/\//i.test(href)) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }

    onCtaClick?.(href);
  };

  return (
    <div className={styles.projectSection}>
      <div className={styles.projectHead}>
        <div className={styles.indexLabel}>{section.indexLabel}</div>

        <div className={styles.projectIntro}>
          <h2 className={styles.title}>{section.title}</h2>
          <p className={styles.desc}>{section.desc}</p>
        </div>
      </div>

      <div className={styles.projectViewport}>
        <div ref={projectTrackRef} className={styles.projectTrack}>
          {cards.map((card, index) => (
            <article
              key={card.step}
              data-project-card
              data-card-index={index}
              className={`${styles.projectCard} ${
                index === currentProjectCard ? styles.projectCardActive : ""
              }`}
            >
              <div className={styles.projectCardBody}>
                <div className={styles.projectVisualArea}>
                  <div className={styles.projectCardTop}>
                    <p className={styles.projectCardCategory}>
                      {card.category ?? card.title}
                    </p>
                    <p className={styles.projectCardStep}>{card.step}</p>
                  </div>

                  <div className={styles.projectMedia}>
                    {card.imageSrc ? (
                      <img
                        src={card.imageSrc}
                        alt={card.imageAlt ?? card.title}
                        className={styles.projectMediaImage}
                      />
                    ) : (
                      <div className={styles.projectMediaPlaceholder}>
                        <span className={styles.projectMediaPlaceholderLabel}>
                          PROJECT REVIEW
                        </span>
                        <strong className={styles.projectMediaPlaceholderTitle}>
                          {card.category ?? card.title}
                        </strong>
                        <p className={styles.projectMediaPlaceholderText}>
                          public/images/card 폴더에 프로젝트 이미지를 넣어 연결할 수 있습니다.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.projectContentArea}>
                  <div className={styles.projectCardInfo}>
                    <h3 className={styles.projectCardTitle}>{card.title}</h3>
                    <p className={styles.projectCardDesc}>{card.desc}</p>

                    <ul className={styles.metaList}>
                      {card.meta.map((item) => (
                        <li key={item} className={styles.metaItem}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.projectCardFooter}>
                    <button
                      type="button"
                      className={styles.moreButton}
                      onClick={() => handleLinkClick(card.ctaHref ?? "/projects")}
                    >
                      {card.ctaLabel ?? "더보기"}
                    </button>

                    <button
                      type="button"
                      className={styles.siteButton}
                      onClick={() => handleLinkClick(card.siteHref)}
                    >
                      {card.siteLabel ?? "사이트 보기"}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.projectProgress}>
        <span>
          {String(currentProjectCard + 1).padStart(2, "0")} / {" "}
          {String(cards.length).padStart(2, "0")}
        </span>
        <p className={styles.projectHint}>
          Desktop: wheel / ↑↓ / ←→ · Mobile: swipe up/down and left/right
        </p>
      </div>
    </div>
  );
}
