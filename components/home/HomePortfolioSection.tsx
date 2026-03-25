import type { MainSection } from "./home.types";
import styles from "./HomePortfolioSection.module.scss";

type Props = {
  section: MainSection;
  onLinkClick?: (href?: string) => void;
};

export default function HomePortfolioSection({ section, onLinkClick }: Props) {
  return (
    <div className={styles.portfolioLayout}>
      <div className={styles.headerRow}>
        <div className={styles.indexLabel}>{section.indexLabel}</div>
        <div>
          <h2 className={styles.title}>{section.title}</h2>
          <p className={styles.desc}>{section.desc}</p>
        </div>
      </div>

      {section.bullets?.length ? (
        <div className={styles.cardGrid}>
          {section.bullets.map((item, index) => (
            <article key={item} className={styles.card}>
              <p className={styles.cardIndex}>0{index + 1}</p>
              <p className={styles.cardText}>{item}</p>
            </article>
          ))}
        </div>
      ) : null}

      {section.links?.[0] ? (
        <button type="button" className={styles.ctaButton} onClick={() => onLinkClick?.(section.links?.[0].href)}>
          {section.links[0].label}
        </button>
      ) : null}
    </div>
  );
}
