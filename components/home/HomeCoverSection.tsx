"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import gsap from "gsap";
import type { MainSection } from "./home.types";
import styles from "./HomeCoverSection.module.scss";

type HomeCoverSectionProps = {
  section: MainSection;
  isActive: boolean;
};

type SymbolItem = {
  key: string;
  label: string;
  cell: { row: number; col: number };
  viewBox: string;
  content: ReactNode;
};

export default function HomeCoverSection({ isActive }: HomeCoverSectionProps) {
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);
  const strokeRefs = useRef<(SVGGElement | null)[]>([]);

  const symbols = useMemo<SymbolItem[]>(
    () => [
      { key: "o", label: "O", cell: { row: 1, col: 1 }, viewBox: "0 0 220 220", content: <circle cx="110" cy="110" r="72" /> },
      { key: "eu", label: "ㅡ", cell: { row: 2, col: 2 }, viewBox: "0 0 220 220", content: <line x1="38" y1="110" x2="182" y2="110" /> },
      { key: "l", label: "L", cell: { row: 3, col: 3 }, viewBox: "0 0 220 220", content: <><line x1="64" y1="42" x2="64" y2="174" /><line x1="64" y1="174" x2="168" y2="174" /></> },
      { key: "a", label: "A", cell: { row: 4, col: 4 }, viewBox: "0 0 220 220", content: <><line x1="58" y1="160" x2="110" y2="54" /><line x1="162" y1="160" x2="110" y2="54" /></> },
      { key: "t", label: "T", cell: { row: 5, col: 5 }, viewBox: "0 0 220 220", content: <><line x1="40" y1="62" x2="180" y2="62" /><line x1="110" y1="62" x2="110" y2="176" /></> },
    ],
    []
  );

  useEffect(() => {
    const groups = groupRefs.current.filter(Boolean) as HTMLDivElement[];
    const strokes = strokeRefs.current.filter(Boolean) as SVGGElement[];

    strokes.forEach((stroke) => {
      gsap.set(stroke, {
        strokeDasharray: 360,
        strokeDashoffset: isActive ? 360 : 0,
        opacity: isActive ? 1 : 0.6,
      });
    });

    gsap.killTweensOf(groups);
    gsap.killTweensOf(strokes);

    if (isActive) {
      gsap.to(strokes, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: "power2.out",
        stagger: 0.1,
      });

      groups.forEach((group, index) => {
        gsap.set(group, { opacity: 1, scale: 1, x: 0, y: 0, rotation: 0 });
        gsap.to(group, {
          y: index % 2 === 0 ? -8 : 8,
          x: index % 2 === 0 ? 5 : -5,
          rotation: index % 2 === 0 ? -1.2 : 1.2,
          duration: 2.8 + index * 0.18,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.12 + index * 0.08,
        });
      });
    }

    return () => {
      gsap.killTweensOf(groups);
      gsap.killTweensOf(strokes);
    };
  }, [isActive]);

  return (
    <div className={styles.cover}>
      <div className={styles.symbolStage} aria-label="O-LAT cover artwork">
        <div className={styles.symbolGrid}>
          {symbols.map((symbol, index) => (
            <div
              key={symbol.key}
              ref={(el) => {
                groupRefs.current[index] = el;
              }}
              className={styles.symbolWrap}
              style={{ gridRow: symbol.cell.row, gridColumn: symbol.cell.col }}
            >
              <svg viewBox={symbol.viewBox} className={styles.symbolSvg} role="img" aria-label={symbol.label}>
                <g
                  ref={(el) => {
                    strokeRefs.current[index] = el;
                  }}
                  className={styles.symbolStroke}
                >
                  {symbol.content}
                </g>
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
