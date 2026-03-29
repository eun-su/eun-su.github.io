"use client";

import { useMemo, useState } from "react";
import type { MainSection } from "./home.types";
import styles from "./HomeContactSection.module.scss";

type Props = {
  section: MainSection;
};

function normalizeHref(href: string) {
  const trimmed = href.trim();

  if (!trimmed) {
    return "#";
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("#")
  ) {
    return trimmed;
  }

  const looksLikeEmail = trimmed.includes("@") && !trimmed.includes("/") && !trimmed.includes(" ");
  if (looksLikeEmail) {
    return `mailto:${trimmed}`;
  }

  return `https://${trimmed}`;
}

export default function HomeContactSection({ section }: Props) {
  const [hasBgError, setHasBgError] = useState(false);

  const normalizedLinks = useMemo(() => {
    return (section.links ?? []).map((link) => ({
      ...link,
      normalizedHref: normalizeHref(link.href),
    }));
  }, [section.links]);

  return (
    <div className={styles.contactSection}>
      <div className={styles.backgroundLayer} aria-hidden="true">
        {!hasBgError ? (
          <img
            src="/images/contact/contact-bg.jpg"
            alt=""
            className={styles.backgroundImage}
            onError={() => setHasBgError(true)}
          />
        ) : (
          <div className={styles.backgroundFallback} />
        )}
        <div className={styles.backgroundOverlay} />
      </div>

      <div className={styles.contentLayer}>
        <div className={styles.topRow}>
          <span className={styles.indexLabel}>{section.indexLabel}</span>
        </div>

        <div className={styles.mainGrid}>
          <div className={styles.messageBlock}>
            <h2 className={styles.title}>{section.title}</h2>
            <div className={styles.descriptionGroup}>
              {section.desc
                .split("\n")
                .filter(Boolean)
                .map((paragraph) => (
                  <p key={paragraph} className={styles.description}>
                    {paragraph}
                  </p>
                ))}
            </div>
          </div>

          <aside className={styles.linkBlock}>
            <p className={styles.linkHeading}>Connect</p>
            <ul className={styles.linkList}>
              {normalizedLinks.map((link) => {
                const isExternal =
                  link.normalizedHref.startsWith("http://") ||
                  link.normalizedHref.startsWith("https://");

                return (
                  <li key={`${link.label}-${link.href}`} className={styles.linkItem}>
                    <span className={styles.linkLabel}>{link.label}</span>
                    <a
                      href={link.normalizedHref}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noreferrer noopener" : undefined}
                      className={styles.linkAnchor}
                    >
                      {link.href}
                    </a>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>

        <div className={styles.bottomRow}>
          <a href="/favorites" className={styles.favoritesButton}>
            Favorites
          </a>
        </div>
      </div>
    </div>
  );
}
