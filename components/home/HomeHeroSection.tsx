import styles from "@/app/HomePage.module.scss";
import type { MainSection } from "./home.types";

type HomeHeroSectionProps = {
  section: MainSection;
  onCtaClick?: (href?: string) => void;
};

export default function HomeHeroSection({
  section,
  onCtaClick,
}: HomeHeroSectionProps) {
  return (
    <div className={styles.heroContent}>
      <div className={styles.heroIndex}>{section.indexLabel}</div>

      <div className={styles.heroCopy}>
        <h1 className={styles.heroTitle}>{section.title}</h1>
        <p className={styles.heroDesc}>{section.desc}</p>

        {section.meta && section.meta.length > 0 && (
          <ul className={styles.metaList}>
            {section.meta.map((item) => (
              <li key={item} className={styles.metaItem}>
                {item}
              </li>
            ))}
          </ul>
        )}

        {section.ctaLabel && (
          <button
            type="button"
            onClick={() => onCtaClick?.(section.ctaHref)}
            className={styles.ctaButton}
          >
            {section.ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
}