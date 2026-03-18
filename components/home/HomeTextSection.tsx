import styles from "@/app/HomePage.module.scss";
import type { MainSection } from "./home.types";

type HomeTextSectionProps = {
  section: MainSection;
  onCtaClick?: (href?: string) => void;
};

export default function HomeTextSection({
  section,
  onCtaClick,
}: HomeTextSectionProps) {
  return (
    <div className={styles.content}>
      <div className={styles.indexLabel}>{section.indexLabel}</div>

      <div className={styles.copy}>
        <h2 className={styles.title}>{section.title}</h2>
        <p className={styles.desc}>{section.desc}</p>

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