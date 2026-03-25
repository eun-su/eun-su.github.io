import styles from "@/app/HomePage.module.scss";
import type { MainSection, ProjectCard } from "./home.types";

type HomeProjectCardsSectionProps = {
  section: MainSection;
  cards: ProjectCard[];
  currentProjectCard: number;
  projectTrackRef: React.RefObject<HTMLDivElement | null>;
};

export default function HomeProjectCardsSection({
  section,
  cards,
  currentProjectCard,
  projectTrackRef,
}: HomeProjectCardsSectionProps) {
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
                <div className={styles.projectCardStep}>{card.step}</div>
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
