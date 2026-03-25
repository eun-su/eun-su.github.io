import type { MainSection } from "./home.types";
import styles from "./HomeDesignSection.module.scss";

type Props = {
  section: MainSection;
  onLinkClick?: (href?: string) => void;
};

export default function HomeDesignSection({ section, onLinkClick }: Props) {
  return (
    <div className={styles.designLayout}>
      <div className={styles.indexLabel}>{section.indexLabel}</div>
      <div className={styles.contentBox}>
        <h2 className={styles.title}>{section.title}</h2>
        <p className={styles.desc}>{section.desc}</p>

        {section.bullets?.length ? (
          <ul className={styles.bulletList}>
            {section.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}

        {section.tags?.length ? (
          <ul className={styles.tagList}>
            {section.tags.map((tag) => (
              <li key={tag} className={styles.tagItem}>{tag}</li>
            ))}
          </ul>
        ) : null}

        {section.links?.[0] ? (
          <button type="button" className={styles.ctaButton} onClick={() => onLinkClick?.(section.links?.[0].href)}>
            {section.links[0].label}
          </button>
        ) : null}
      </div>
    </div>
  );
}
