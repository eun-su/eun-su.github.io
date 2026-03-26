"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { MainSection } from "./home.types";
import styles from "./HomeCoverSection.module.scss";

type HomeCoverSectionProps = {
  section: MainSection;
  isActive: boolean;
};

type Point = {
  col: number;
  row: number;
};

type SymbolItem = {
  key: string;
  label: string;
  row: number;
  col: number;
  src: string;
  className: string;
  path: Point[];
  motion: {
    duration: string;
    delay: string;
    y: string;
    x: string;
    rotate: string;
    baseY: string;
  };
};

type AnnotationItem = {
  id: string;
  symbolKey: string;
  text: string;
  triggerHoldIndex: number;
};

type LabelState = {
  text: string;
  opacity: number;
};

type MotionStyle = CSSProperties & Record<string, string | number>;

const HOLD_SECONDS = 5;
const MOVE_SECONDS = 0.8;
const TYPE_SECONDS = 1;
const FADE_START_SECONDS = 3;
const FADE_DURATION_SECONDS = 1;
const PATH_POINT_COUNT = 9;
const ROUTE_TOTAL_SECONDS =
  PATH_POINT_COUNT * HOLD_SECONDS + (PATH_POINT_COUNT - 1) * MOVE_SECONDS;

const symbols: SymbolItem[] = [
  {
    key: "o",
    label: "O",
    row: 3,
    col: 1,
    src: "/images/cover/coverO.svg",
    className: styles.symbolO,
    path: [
      { col: 1, row: 3 },
      { col: 1, row: 1 },
      { col: 3, row: 1 },
      { col: 5, row: 1 },
      { col: 3, row: 1 },
      { col: 1, row: 1 },
      { col: 1, row: 3 },
      { col: 1, row: 5 },
      { col: 1, row: 3 },
    ],
    motion: {
      duration: "5.8s",
      delay: "0s",
      y: "-4px",
      x: "2px",
      rotate: "-1.2deg",
      baseY: "-1vw",
    },
  },
  {
    key: "dash",
    label: "ㅡ",
    row: 3,
    col: 2,
    src: "/images/cover/coverD.svg",
    className: styles.symbolDash,
    path: [
      { col: 2, row: 3 },
      { col: 2, row: 2 },
      { col: 3, row: 2 },
      { col: 4, row: 2 },
      { col: 3, row: 2 },
      { col: 2, row: 2 },
      { col: 2, row: 3 },
      { col: 2, row: 4 },
      { col: 2, row: 3 },
    ],
    motion: {
      duration: "4.9s",
      delay: "0.12s",
      y: "4px",
      x: "-2px",
      rotate: "1deg",
      baseY: "-3.5vw",
    },
  },
  {
    key: "l",
    label: "L",
    row: 3,
    col: 3,
    src: "/images/cover/coverL.svg",
    className: styles.symbolL,
    path: [
      { col: 3, row: 3 },
      { col: 3, row: 3 },
      { col: 3, row: 3 },
      { col: 3, row: 3 },
      { col: 3, row: 3 },
      { col: 3, row: 3 },
      { col: 3, row: 3 },
      { col: 3, row: 3 },
      { col: 3, row: 3 },
    ],
    motion: {
      duration: "5.2s",
      delay: "0.18s",
      y: "-4px",
      x: "2px",
      rotate: "-0.8deg",
      baseY: "-5vw",
    },
  },
  {
    key: "a",
    label: "A",
    row: 3,
    col: 4,
    src: "/images/cover/coverA.svg",
    className: styles.symbolA,
    path: [
      { col: 4, row: 3 },
      { col: 4, row: 4 },
      { col: 3, row: 4 },
      { col: 2, row: 4 },
      { col: 3, row: 4 },
      { col: 4, row: 4 },
      { col: 4, row: 3 },
      { col: 4, row: 2 },
      { col: 4, row: 3 },
    ],
    motion: {
      duration: "5.1s",
      delay: "0.26s",
      y: "4px",
      x: "-2px",
      rotate: "0.9deg",
      baseY: "-1vw",
    },
  },
  {
    key: "t",
    label: "T",
    row: 3,
    col: 5,
    src: "/images/cover/coverT.svg",
    className: styles.symbolT,
    path: [
      { col: 5, row: 3 },
      { col: 5, row: 5 },
      { col: 3, row: 5 },
      { col: 1, row: 5 },
      { col: 3, row: 5 },
      { col: 5, row: 5 },
      { col: 5, row: 3 },
      { col: 5, row: 1 },
      { col: 5, row: 3 },
    ],
    motion: {
      duration: "5.6s",
      delay: "0.34s",
      y: "-4px",
      x: "2px",
      rotate: "-1.1deg",
      baseY: "1vw",
    },
  },
];

const annotations: AnnotationItem[] = [
  {
    id: "origin",
    symbolKey: "o",
    text: "Origin",
    triggerHoldIndex: 1,
  },
  {
    id: "layout",
    symbolKey: "l",
    text: "Layout",
    triggerHoldIndex: 1,
  },
  {
    id: "aesthetic",
    symbolKey: "a",
    text: "Aesthetic",
    triggerHoldIndex: 3,
  },
  {
    id: "technology",
    symbolKey: "t",
    text: "Technology",
    triggerHoldIndex: 3,
  },
];

function buildMotionVars(item: SymbolItem): MotionStyle {
  const vars: MotionStyle = {
    "--float-duration": item.motion.duration,
    "--float-delay": item.motion.delay,
    "--float-y": item.motion.y,
    "--float-x": item.motion.x,
    "--float-rotate": item.motion.rotate,
    "--base-y": item.motion.baseY,
    "--route-duration": `${ROUTE_TOTAL_SECONDS}s`,
    gridRow: item.row,
    gridColumn: item.col,
  };

  item.path.forEach((point, index) => {
    vars[`--p${index}x`] = `${(point.col - item.col) * 100}%`;
    vars[`--p${index}y`] = `${(point.row - item.row) * 100}%`;
  });

  return vars;
}

function getTypedText(fullText: string, elapsedInHold: number) {
  const progress = Math.max(0, Math.min(elapsedInHold / TYPE_SECONDS, 1));
  const visibleCount = Math.floor(fullText.length * progress);
  return fullText.slice(0, visibleCount);
}

function getLabelOpacity(elapsedInHold: number) {
  if (elapsedInHold < FADE_START_SECONDS) return 1;

  const fadeElapsed = elapsedInHold - FADE_START_SECONDS;
  if (fadeElapsed >= FADE_DURATION_SECONDS) return 0;

  return 1 - fadeElapsed / FADE_DURATION_SECONDS;
}

export default function HomeCoverSection({
  section,
  isActive,
}: HomeCoverSectionProps) {
  const captionText = "O-LAT means Origin Layout & Advanced Technology.";
  const cycleStartRef = useRef<number | null>(null);
  const [labelStates, setLabelStates] = useState<Record<string, LabelState>>({});

  const annotationsBySymbol = useMemo(() => {
    return annotations.reduce<Record<string, AnnotationItem[]>>((acc, item) => {
      if (!acc[item.symbolKey]) acc[item.symbolKey] = [];
      acc[item.symbolKey].push(item);
      return acc;
    }, {});
  }, []);

  useEffect(() => {
    if (!isActive) {
      setLabelStates({});
      cycleStartRef.current = null;
      return;
    }

    cycleStartRef.current = performance.now();

    let frameId = 0;

    const tick = (now: number) => {
      if (cycleStartRef.current === null) {
        cycleStartRef.current = now;
      }

      const elapsedSeconds =
        ((now - cycleStartRef.current) / 1000) % ROUTE_TOTAL_SECONDS;

      const nextStates: Record<string, LabelState> = {};

      for (const item of annotations) {
        const holdStart =
          item.triggerHoldIndex * HOLD_SECONDS +
          item.triggerHoldIndex * MOVE_SECONDS;
        const holdEnd = holdStart + HOLD_SECONDS;

        if (elapsedSeconds >= holdStart && elapsedSeconds < holdEnd) {
          const elapsedInHold = elapsedSeconds - holdStart;
          const text = getTypedText(item.text, elapsedInHold);
          const opacity = getLabelOpacity(elapsedInHold);

          if (text.length > 0 && opacity > 0) {
            nextStates[item.id] = {
              text,
              opacity,
            };
          }
        }
      }

      setLabelStates(nextStates);
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isActive]);

  return (
    <div className={styles.cover}>
      <div
        className={styles.symbolStage}
        data-active={isActive ? "true" : "false"}
        aria-label={section.highlight ?? "O-LAT cover artwork"}
      >
        <div className={styles.symbolGrid}>
          {symbols.map((symbol) => {
            const relatedAnnotations = annotationsBySymbol[symbol.key] ?? [];

            return (
              <div
                key={symbol.key}
                className={styles.symbolWrap}
                style={buildMotionVars(symbol)}
                aria-label={symbol.label}
                role="img"
              >
                <div className={styles.symbolRoute}>
                  <div className={`${styles.symbolFloat} ${symbol.className}`}>
                    <img
                      src={symbol.src}
                      alt={symbol.label}
                      className={styles.symbolImage}
                      draggable={false}
                    />

                    {relatedAnnotations.map((item) => {
                      const currentState = labelStates[item.id];
                      const isVisible = Boolean(currentState);

                      return (
                        <span
                          key={item.id}
                          className={`${styles.symbolLabel} ${
                            isVisible ? styles.symbolLabelVisible : ""
                          }`}
                          style={{
                            opacity: currentState?.opacity ?? 0,
                          }}
                          aria-hidden={!isVisible}
                        >
                          {currentState?.text ?? ""}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.captionViewport} aria-label={captionText}>
          <p className={styles.captionText}>{captionText}</p>
        </div>
      </div>
    </div>
  );
}