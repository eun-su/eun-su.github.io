import type { MainSection } from "./home.types";
import styles from "./HomeProjectSection.module.scss";

export default function HomeProjectSection({ section }: { section: MainSection }) {
  return (
    <div className={styles.projectLayout}>
      <div className={styles.projectLabelBox}>
        <div className={styles.indexLabel}>{section.indexLabel}</div>
        {section.tags?.length ? (
          <ul className={styles.tagList}>
            {section.tags.map((tag) => (
              <li key={tag} className={styles.tagItem}>{tag}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className={styles.projectBody}>
        <h2 className={styles.title}>{section.title}</h2>
        <p className={styles.desc}>{section.desc}</p>

        {section.bullets?.length ? (
          <div className={styles.detailGrid}>
            {section.bullets.map((item, index) => (
              <article key={item} className={styles.detailCard}>
                <p className={styles.detailIndex}>{section.indexLabel}.{index + 1}</p>
                <p className={styles.detailText}>{item}</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
