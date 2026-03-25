import styles from "@/app/HomePage.module.scss";
import type { ReactNode } from "react";

type HomeSectionShellProps = {
  id: string;
  eyebrow: string;
  sectionNumber: string;
  children: ReactNode;
  className?: string;
  sectionRef?: (el: HTMLElement | null) => void;
};

export default function HomeSectionShell({
  id,
  eyebrow,
  sectionNumber,
  children,
  className = "",
  sectionRef,
}: HomeSectionShellProps) {
  return (
    <section
      id={id}
      ref={sectionRef}
      className={`${styles.section} ${className}`.trim()}
    >
      <div className={styles.sectionInner}>
        {eyebrow ? (
          <div className={styles.sectionTop}>
            <p className={styles.eyebrow}>{eyebrow}</p>
          </div>
        ) : null}

        {children}

        <div className={styles.sectionNumber}>{sectionNumber}</div>
      </div>
    </section>
  );
}
