import type { CSSProperties } from "react";
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

type MotionStyle = CSSProperties & Record<string, string | number>;

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
      y: "-8px",
      x: "4px",
      rotate: "-1.2deg",
      baseY: "6px",
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
      y: "6px",
      x: "-4px",
      rotate: "1deg",
      baseY: "-3vw",
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
      y: "-7px",
      x: "3px",
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
      y: "7px",
      x: "-3px",
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
      y: "-8px",
      x: "4px",
      rotate: "-1.1deg",
      baseY: "1vw",
    },
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
    gridRow: item.row,
    gridColumn: item.col,
  };

  item.path.forEach((point, index) => {
    vars[`--p${index}x`] = `${(point.col - item.col) * 100}%`;
    vars[`--p${index}y`] = `${(point.row - item.row) * 100}%`;
  });

  return vars;
}

export default function HomeCoverSection({
  section,
  isActive,
}: HomeCoverSectionProps) {
  const marqueeText = "O-LAT means Origin Layout & Advanced Technology.";

  return (
    <div className={styles.cover}>
      <div
        className={styles.symbolStage}
        data-active={isActive ? "true" : "false"}
        aria-label={section.highlight ?? "O-LAT cover artwork"}
      >
        <div className={styles.symbolGrid}>
          {symbols.map((symbol) => (
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
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.captionViewport} aria-label={marqueeText}>
          <p className={styles.captionTrack}>
            <span className={styles.captionItem}>{marqueeText}</span>
            <span className={styles.captionItem} aria-hidden="true">
              {marqueeText}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}