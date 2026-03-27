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

type AnnotationTrigger = {
  symbolKey: string;
  col: number;
  row: number;
};

type AnnotationItem = {
  id: string;
  symbolKey: string;
  text: string;
  trigger: AnnotationTrigger;
};

type LabelState = {
  text: string;
  opacity: number;
};

type NameState = {
  kim: string;
  eun: string;
  su: string;
};

type MotionStyle = CSSProperties & Record<string, string | number>;

type TimelineState =
  | {
      phase: "hold";
      holdIndex: number;
      elapsedInHold: number;
    }
  | {
      phase: "move";
      fromIndex: number;
      toIndex: number;
      progress: number;
    };

const HOLD_SECONDS = 5;
const MOVE_SECONDS = 0.8;
const TYPE_SECONDS = 1;
const FADE_START_SECONDS = 3;
const FADE_DURATION_SECONDS = 1;
const DELETE_START_SECONDS = 3;
const DELETE_DURATION_SECONDS = 1;
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
    trigger: {
      symbolKey: "o",
      col: 1,
      row: 1,
    },
  },
  {
    id: "layout",
    symbolKey: "l",
    text: "Layout",
    trigger: {
      symbolKey: "o",
      col: 1,
      row: 1,
    },
  },
  {
    id: "aesthetic",
    symbolKey: "a",
    text: "Aesthetic",
    trigger: {
      symbolKey: "t",
      col: 1,
      row: 5,
    },
  },
  {
    id: "technology",
    symbolKey: "t",
    text: "Technology",
    trigger: {
      symbolKey: "t",
      col: 1,
      row: 5,
    },
  },
];

function buildMotionVars(item: SymbolItem): MotionStyle {
  return {
    "--float-duration": item.motion.duration,
    "--float-delay": item.motion.delay,
    "--float-y": item.motion.y,
    "--float-x": item.motion.x,
    "--float-rotate": item.motion.rotate,
    "--base-y": item.motion.baseY,
    gridRow: item.row,
    gridColumn: item.col,
  };
}

function easeInCubic(value: number) {
  return value * value * value;
}

function getTimelineState(elapsedSeconds: number): TimelineState {
  let time = elapsedSeconds % ROUTE_TOTAL_SECONDS;

  for (let index = 0; index < PATH_POINT_COUNT; index += 1) {
    if (time < HOLD_SECONDS) {
      return {
        phase: "hold",
        holdIndex: index,
        elapsedInHold: time,
      };
    }

    time -= HOLD_SECONDS;

    if (index === PATH_POINT_COUNT - 1) {
      break;
    }

    if (time < MOVE_SECONDS) {
      return {
        phase: "move",
        fromIndex: index,
        toIndex: index + 1,
        progress: easeInCubic(time / MOVE_SECONDS),
      };
    }

    time -= MOVE_SECONDS;
  }

  return {
    phase: "hold",
    holdIndex: PATH_POINT_COUNT - 1,
    elapsedInHold: HOLD_SECONDS,
  };
}

function getPositionForSymbol(symbol: SymbolItem, timeline: TimelineState) {
  if (timeline.phase === "hold") {
    const point = symbol.path[timeline.holdIndex];
    return {
      col: point.col,
      row: point.row,
      translateX: (point.col - symbol.col) * 100,
      translateY: (point.row - symbol.row) * 100,
    };
  }

  const fromPoint = symbol.path[timeline.fromIndex];
  const toPoint = symbol.path[timeline.toIndex];

  const col = fromPoint.col + (toPoint.col - fromPoint.col) * timeline.progress;
  const row = fromPoint.row + (toPoint.row - fromPoint.row) * timeline.progress;

  return {
    col,
    row,
    translateX: (col - symbol.col) * 100,
    translateY: (row - symbol.row) * 100,
  };
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

function getTypingDeleteText(fullText: string, elapsedInHold: number) {
  if (elapsedInHold < 0) return "";

  if (elapsedInHold < TYPE_SECONDS) {
    const progress = elapsedInHold / TYPE_SECONDS;
    const visibleCount = Math.floor(fullText.length * progress);
    return fullText.slice(0, visibleCount);
  }

  if (elapsedInHold < DELETE_START_SECONDS) {
    return fullText;
  }

  if (elapsedInHold < DELETE_START_SECONDS + DELETE_DURATION_SECONDS) {
    const progress =
      (elapsedInHold - DELETE_START_SECONDS) / DELETE_DURATION_SECONDS;
    const visibleCount = Math.ceil(fullText.length * (1 - progress));
    return fullText.slice(0, Math.max(0, visibleCount));
  }

  return "";
}

export default function HomeCoverSection({
  section,
  isActive,
}: HomeCoverSectionProps) {
  const captionText = "O-LAT means Origin Layout & Advanced Technology.";

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isDesktopWide, setIsDesktopWide] = useState(false);

  const rafRef = useRef<number | null>(null);
  const startMsRef = useRef<number | null>(null);
  const pausedElapsedRef = useRef(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1025px)");

    const syncDesktopState = () => {
      setIsDesktopWide(mediaQuery.matches);
    };

    syncDesktopState();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncDesktopState);
      return () => {
        mediaQuery.removeEventListener("change", syncDesktopState);
      };
    }

    mediaQuery.addListener(syncDesktopState);
    return () => {
      mediaQuery.removeListener(syncDesktopState);
    };
  }, []);

  useEffect(() => {
    const stopLoop = () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    if (!isActive) {
      stopLoop();

      if (startMsRef.current !== null) {
        pausedElapsedRef.current =
          (performance.now() - startMsRef.current) / 1000;
      }

      return stopLoop;
    }

    startMsRef.current = performance.now() - pausedElapsedRef.current * 1000;

    const tick = (now: number) => {
      if (startMsRef.current === null) {
        startMsRef.current = now;
      }

      const elapsed = (now - startMsRef.current) / 1000;
      pausedElapsedRef.current = elapsed;
      setElapsedSeconds(elapsed % ROUTE_TOTAL_SECONDS);
      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return stopLoop;
  }, [isActive]);

  const timeline = useMemo(() => {
    return getTimelineState(elapsedSeconds);
  }, [elapsedSeconds]);

  const symbolPositions = useMemo(() => {
    return symbols.reduce<
      Record<
        string,
        {
          col: number;
          row: number;
          translateX: number;
          translateY: number;
        }
      >
    >((acc, symbol) => {
      acc[symbol.key] = getPositionForSymbol(symbol, timeline);
      return acc;
    }, {});
  }, [timeline]);

  const labelStates = useMemo<Record<string, LabelState>>(() => {
    if (timeline.phase !== "hold") {
      return {};
    }

    const nextStates: Record<string, LabelState> = {};

    for (const item of annotations) {
      const triggerSymbolPosition = symbolPositions[item.trigger.symbolKey];

      if (!triggerSymbolPosition) continue;

      const isMatched =
        triggerSymbolPosition.col === item.trigger.col &&
        triggerSymbolPosition.row === item.trigger.row;

      if (!isMatched) continue;

      const text = getTypedText(item.text, timeline.elapsedInHold);
      const opacity = getLabelOpacity(timeline.elapsedInHold);

      if (text.length > 0 && opacity > 0) {
        nextStates[item.id] = {
          text,
          opacity,
        };
      }
    }

    return nextStates;
  }, [symbolPositions, timeline]);

  const nameState = useMemo<NameState>(() => {
    if (!isDesktopWide || timeline.phase !== "hold") {
      return { kim: "", eun: "", su: "" };
    }

    const isVerticalColumnAlign = symbols.every((symbol) => {
      const position = symbolPositions[symbol.key];
      return position && position.col === 3;
    });

    if (!isVerticalColumnAlign) {
      return { kim: "", eun: "", su: "" };
    }

    return {
      kim: getTypingDeleteText("KIM", timeline.elapsedInHold),
      eun: getTypingDeleteText("EUN", timeline.elapsedInHold),
      su: getTypingDeleteText("SU", timeline.elapsedInHold),
    };
  }, [isDesktopWide, symbolPositions, timeline]);

  const showNameLayer =
    isDesktopWide &&
    (nameState.kim.length > 0 ||
      nameState.eun.length > 0 ||
      nameState.su.length > 0);

  const annotationsBySymbol = useMemo(() => {
    return annotations.reduce<Record<string, AnnotationItem[]>>((acc, item) => {
      if (!acc[item.symbolKey]) acc[item.symbolKey] = [];
      acc[item.symbolKey].push(item);
      return acc;
    }, {});
  }, []);

  return (
    <div className={styles.cover}>
      <div
        className={styles.symbolStage}
        data-active={isActive ? "true" : "false"}
        aria-label={section.highlight ?? "O-LAT cover artwork"}
      >
        {isDesktopWide && (
          <div
            className={`${styles.nameLayer} ${
              showNameLayer ? styles.nameLayerVisible : ""
            }`}
            aria-hidden="true"
          >
            <div className={styles.kimBlock}>{nameState.kim}</div>

            <div className={styles.rightNameGroup}>
              <div className={styles.eunBlock}>{nameState.eun}</div>
              <div className={styles.suBlock}>{nameState.su}</div>
            </div>
          </div>
        )}

        <div className={styles.symbolGrid}>
          {symbols.map((symbol) => {
            const relatedAnnotations = annotationsBySymbol[symbol.key] ?? [];
            const route = symbolPositions[symbol.key];

            return (
              <div
                key={symbol.key}
                className={styles.symbolWrap}
                style={buildMotionVars(symbol)}
                aria-label={symbol.label}
                role="img"
              >
                <div
                  className={styles.symbolRoute}
                  style={{
                    transform: `translate(${route.translateX}%, ${route.translateY}%)`,
                  }}
                >
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