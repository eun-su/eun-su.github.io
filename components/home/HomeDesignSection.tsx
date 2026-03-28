"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { MainSection } from "./home.types";
import styles from "./HomeDesignSection.module.scss";

type Props = {
  section: MainSection;
  onLinkClick?: (href?: string) => void;
};

type BannerItem = {
  id: string;
  src?: string;
  alt: string;
  toneClass: string;
};

type BannerStyleVars = CSSProperties & {
  "--loop-distance"?: string;
  "--loop-duration"?: string;
};

const bannerRows: BannerItem[][] = [
  [
    { id: "design-01", src: "/images/design/design01.jpg", alt: "Design banner 01", toneClass: styles.toneA },
    { id: "design-02", src: "/images/design/design02.jpg", alt: "Design banner 02", toneClass: styles.toneB },
    { id: "design-03", src: "/images/design/design03.jpg", alt: "Design banner 03", toneClass: styles.toneC },
    { id: "design-04", src: "/images/design/design04.jpg", alt: "Design banner 04", toneClass: styles.toneD },
    { id: "design-05", src: "/images/design/design05.jpg", alt: "Design banner 05", toneClass: styles.toneA },
    { id: "design-06", src: "/images/design/design06.jpg", alt: "Design banner 06", toneClass: styles.toneB },
    { id: "design-19", src: "/images/design/design19.jpg", alt: "Design banner 19", toneClass: styles.toneC },
    { id: "design-20", src: "/images/design/design20.jpg", alt: "Design banner 20", toneClass: styles.toneC },
  ],
  [
    { id: "design-07", src: "/images/design/design07.jpg", alt: "Design banner 07", toneClass: styles.toneB },
    { id: "design-08", src: "/images/design/design08.jpg", alt: "Design banner 08", toneClass: styles.toneC },
    { id: "design-09", src: "/images/design/design09.jpg", alt: "Design banner 09", toneClass: styles.toneD },
    { id: "design-10", src: "/images/design/design10.jpg", alt: "Design banner 10", toneClass: styles.toneA },
    { id: "design-11", src: "/images/design/design11.jpg", alt: "Design banner 11", toneClass: styles.toneB },
    { id: "design-12", src: "/images/design/design12.jpg", alt: "Design banner 12", toneClass: styles.toneC },
  ],
  [
    { id: "design-13", src: "/images/design/design13.jpg", alt: "Design banner 13", toneClass: styles.toneC },
    { id: "design-14", src: "/images/design/design14.jpg", alt: "Design banner 14", toneClass: styles.toneD },
    { id: "design-15", src: "/images/design/design15.jpg", alt: "Design banner 15", toneClass: styles.toneA },
    { id: "design-16", src: "/images/design/design16.jpg", alt: "Design banner 16", toneClass: styles.toneB },
    { id: "design-17", src: "/images/design/design17.jpg", alt: "Design banner 17", toneClass: styles.toneC },
    { id: "design-18", src: "/images/design/design18.jpg", alt: "Design banner 18", toneClass: styles.toneD },
    { id: "design-22", src: "/images/design/design22.jpg", alt: "Design banner 22", toneClass: styles.toneD },
  ],
];

function BannerMedia({
  item,
  onSizeChange,
}: {
  item: BannerItem;
  onSizeChange: () => void;
}) {
  const [hasError, setHasError] = useState(false);

  if (!item.src || hasError) {
    return (
      <div className={`${styles.placeholderCard} ${item.toneClass}`}>
        <span className={styles.placeholderLabel}>Design Work</span>
      </div>
    );
  }

  return (
    <img
      src={item.src}
      alt={item.alt}
      className={styles.bannerImage}
      onLoad={onSizeChange}
      onError={() => {
        setHasError(true);
        onSizeChange();
      }}
    />
  );
}

function BannerSet({
  row,
  suffix,
  setRef,
  onSizeChange,
}: {
  row: BannerItem[];
  suffix: string;
  setRef?: (node: HTMLDivElement | null) => void;
  onSizeChange: () => void;
}) {
  return (
    <div
      ref={setRef}
      className={styles.bannerSet}
      aria-hidden={suffix !== "middle"}
    >
      {row.map((item) => (
        <div key={`${item.id}-${suffix}`} className={styles.bannerItem}>
          <BannerMedia item={item} onSizeChange={onSizeChange} />
        </div>
      ))}
    </div>
  );
}

export default function HomeDesignSection({ section, onLinkClick }: Props) {
  const middleSetRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [loopDistances, setLoopDistances] = useState<number[]>(
    Array.from({ length: bannerRows.length }, () => 0)
  );

  const handleLinkClick = (href?: string) => {
    if (!href) {
      return;
    }

    if (/^https?:\/\//i.test(href)) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }

    onLinkClick?.(href);
  };

  const updateWidths = () => {
    setLoopDistances((prev) => {
      const next = [...prev];
      let changed = false;

      middleSetRefs.current.forEach((node, rowIndex) => {
        if (!node) {
          return;
        }

        const nextWidth = Math.ceil(node.getBoundingClientRect().width);
        if (next[rowIndex] !== nextWidth) {
          next[rowIndex] = nextWidth;
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  };

  useEffect(() => {
    updateWidths();

    const observers: ResizeObserver[] = [];

    middleSetRefs.current.forEach((node) => {
      if (!node) {
        return;
      }

      const observer = new ResizeObserver(() => {
        updateWidths();
      });

      observer.observe(node);
      observers.push(observer);
    });

    window.addEventListener("resize", updateWidths);

    return () => {
      observers.forEach((observer) => observer.disconnect());
      window.removeEventListener("resize", updateWidths);
    };
  }, []);

  return (
    <div className={styles.designSection}>
      <div className={styles.indexLabel}>{section.indexLabel}</div>

      <div className={styles.centerIntro}>
        <h2 className={styles.title}>{section.title}</h2>
        <p className={styles.desc}>{section.desc}</p>
      </div>

      {section.tags?.length ? (
        <ul className={styles.toolList}>
          {section.tags.map((tag) => (
            <li key={tag} className={styles.toolItem}>
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      <div className={styles.bannerGroup}>
        {bannerRows.map((row, rowIndex) => {
          const distance = loopDistances[rowIndex];
          const speedPxPerSecond = 90;
          const durationSeconds =
            distance > 0 ? Math.max(18, distance / speedPxPerSecond) : 28;

          const directionClass =
            rowIndex === 1 ? styles.scrollReverse : styles.scrollForward;

          const styleVars: BannerStyleVars = {
            "--loop-distance": `${distance || 1}px`,
            "--loop-duration": `${durationSeconds}s`,
          };

          return (
            <div key={`banner-row-${rowIndex}`} className={styles.bannerLane}>
              <div
                className={`${styles.bannerTrack} ${directionClass} ${
                  distance > 0 ? styles.isReady : styles.isPending
                }`}
                style={styleVars}
              >
                <BannerSet row={row} suffix="prev" onSizeChange={updateWidths} />
                <BannerSet
                  row={row}
                  suffix="middle"
                  setRef={(node) => {
                    middleSetRefs.current[rowIndex] = node;
                  }}
                  onSizeChange={updateWidths}
                />
                <BannerSet row={row} suffix="next" onSizeChange={updateWidths} />
              </div>
            </div>
          );
        })}
      </div>

      {section.links?.length ? (
        <div className={styles.buttonRow}>
          {section.links.map((link, index) => (
            <button
              key={`${link.label}-${index}`}
              type="button"
              className={
                index === 0 ? styles.primaryButton : styles.secondaryButton
              }
              onClick={() => handleLinkClick(link.href)}
            >
              {link.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}