import type { MainSection } from "./home.types";
import styles from "./HomeIntroSection.module.scss";

export default function HomeIntroSection({ section }: { section: MainSection }) {
  return (
    <div className={styles.introLayout}>
      <div className={styles.headingColumn}>
        <div className={styles.indexLabel}>{section.indexLabel}</div>
        <h2 className={styles.title}>{section.title}</h2>
      </div>

      <div className={styles.bodyColumn}>
        <p className={styles.desc}>{section.desc}</p>

        {section.bullets?.length ? (
          <ul className={styles.bulletList}>
            {section.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}

        {section.stats?.length ? (
          <div className={styles.statsGrid}>
            {section.stats.map((stat) => (
              <article key={stat.label} className={styles.statCard}>
                <p className={styles.statLabel}>{stat.label}</p>
                <p className={styles.statValue}>{stat.value}</p>
              </article>
            ))}
          </div>
        ) : null}

        {section.tags?.length ? (
          <ul className={styles.tagList}>
            {section.tags.map((tag) => (
              <li key={tag} className={styles.tagItem}>{tag}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
