import type { MainSection } from "./home.types";
import styles from "./HomeContactSection.module.scss";

export default function HomeContactSection({ section }: { section: MainSection }) {
  return (
    <div className={styles.contactLayout}>
      <div className={styles.headingBox}>
        <div className={styles.indexLabel}>{section.indexLabel}</div>
        <h2 className={styles.title}>{section.title}</h2>
        <p className={styles.desc}>{section.desc}</p>
      </div>

      <div className={styles.contactBox}>
        {section.links?.length ? (
          <ul className={styles.linkList}>
            {section.links.map((link) => (
              <li key={link.label}>
                <a className={styles.linkItem} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noreferrer" : undefined}>
                  <span>{link.label}</span>
                  <span>{link.href.replace(/^mailto:|^tel:/, "")}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        {section.bullets?.length ? (
          <div className={styles.messageBox}>
            {section.bullets.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
