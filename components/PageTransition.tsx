"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import styles from "./PageTransition.module.scss";

type NavigateEventDetail = {
  href: string;
};

type TransitionTheme = {
  label: string;
  baseColor: string;
  fillColor: string;
  glowColor: string;
  textColor: string;
  textGlowColor: string;
  barTrackColor: string;
  barFillColor: string;
};

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const normalized =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => char + char)
          .join("")
      : clean;

  const num = Number.parseInt(normalized, 16);

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (value: number) =>
    Math.max(0, Math.min(255, Math.round(value)))
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getComplementaryColor(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(255 - r, 255 - g, 255 - b);
}

function getLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);

  const channel = (value: number) => {
    const v = value / 255;
    return v <= 0.03928
      ? v / 12.92
      : ((v + 0.055) / 1.055) ** 2.4;
  };

  const rr = channel(r);
  const gg = channel(g);
  const bb = channel(b);

  return 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
}

function getContrastRatio(hex1: string, hex2: string) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

function lightenHex(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);

  return rgbToHex(
    r + (255 - r) * amount,
    g + (255 - g) * amount,
    b + (255 - b) * amount
  );
}

function darkenHex(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);

  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

function getReadableTextColor(backgroundHex: string, pointHex: string) {
  const complementary = getComplementaryColor(pointHex);
  const lighterComplement = lightenHex(complementary, 0.18);
  const darkerComplement = darkenHex(complementary, 0.22);
  const white = "#FFFFFF";
  const black = "#111111";

  const candidates = [
    { color: complementary, contrast: getContrastRatio(backgroundHex, complementary) },
    {
      color: lighterComplement,
      contrast: getContrastRatio(backgroundHex, lighterComplement),
    },
    {
      color: darkerComplement,
      contrast: getContrastRatio(backgroundHex, darkerComplement),
    },
    { color: white, contrast: getContrastRatio(backgroundHex, white) },
    { color: black, contrast: getContrastRatio(backgroundHex, black) },
  ].sort((a, b) => b.contrast - a.contrast);

  return candidates[0].color;
}

function hexToRgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function makeTheme(
  label: string,
  baseColor: string,
  fillColor: string,
  glowColor: string,
  barTrackColor: string,
  barFillColor?: string
): TransitionTheme {
  const readableTextColor = getReadableTextColor(baseColor, fillColor);
  const textGlowColor = hexToRgba(getComplementaryColor(fillColor), 0.28);

  return {
    label,
    baseColor,
    fillColor,
    glowColor,
    textColor: readableTextColor,
    textGlowColor,
    barTrackColor,
    barFillColor: barFillColor ?? fillColor,
  };
}

const PAGE_THEME_MAP: Record<string, TransitionTheme> = {
  "/": makeTheme(
    "Entering Eunsu World",
    "#FDF5F9",
    "#060AE5",
    "rgba(6, 10, 229, 0.28)",
    "rgba(1, 17, 73, 0.16)",
    "#011149"
  ),
  "/intro": makeTheme(
    "Entering Intro",
    "#F8F9FC",
    "#2D3D59",
    "rgba(45, 61, 89, 0.28)",
    "rgba(45, 61, 89, 0.14)"
  ),
  "/design": makeTheme(
    "Entering Design Works",
    "#F3ECF7",
    "#8A0324",
    "rgba(138, 3, 36, 0.24)",
    "rgba(138, 3, 36, 0.14)"
  ),
  "/study": makeTheme(
    "Entering Study Notes",
    "#FCFCFD",
    "#8E0A22",
    "rgba(142, 10, 34, 0.24)",
    "rgba(142, 10, 34, 0.14)"
  ),
  "/issues": makeTheme(
    "Entering Issue Board",
    "#F4F6FB",
    "#1D2A72",
    "rgba(29, 42, 114, 0.24)",
    "rgba(29, 42, 114, 0.14)"
  ),
  "/favorites": makeTheme(
    "Entering Favorites",
    "#F7F6FA",
    "#4B3F72",
    "rgba(75, 63, 114, 0.24)",
    "rgba(75, 63, 114, 0.14)"
  ),
};

const DEFAULT_THEME = makeTheme(
  "Loading",
  "#F7F6FA",
  "#2D3D59",
  "rgba(45, 61, 89, 0.24)",
  "rgba(45, 61, 89, 0.14)"
);

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const maskGlowRef = useRef<HTMLDivElement | null>(null);
  const maskRef = useRef<HTMLDivElement | null>(null);

  const uiRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLParagraphElement | null>(null);
  const valueRef = useRef<HTMLParagraphElement | null>(null);
  const barTrackRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  const isBusyRef = useRef(false);
  const waitingForRouteRef = useRef(false);
  const hasIntroPlayedRef = useRef(false);
  const introStartedRef = useRef(false);
  const pendingHrefRef = useRef<string | null>(null);

  const setCounterText = (value: number) => {
    if (!valueRef.current) return;
    valueRef.current.textContent = `${Math.round(value)}%`;
  };

  const setLabelText = (text: string) => {
    if (!labelRef.current) return;
    labelRef.current.textContent = text;
  };

  const getPathKey = (href: string) => href.split("#")[0] || "/";

  const getThemeByHref = (href: string, isInitial?: boolean) => {
    const cleanHref = getPathKey(href);
    const theme = PAGE_THEME_MAP[cleanHref] ?? DEFAULT_THEME;

    if (isInitial) {
      return {
        ...theme,
        label: "Entering Eunsu World",
      };
    }

    return theme;
  };

  const applyTheme = (theme: TransitionTheme) => {
    if (
      !overlayRef.current ||
      !maskGlowRef.current ||
      !maskRef.current ||
      !uiRef.current ||
      !barTrackRef.current ||
      !barRef.current
    ) {
      return;
    }

    overlayRef.current.style.backgroundColor = theme.baseColor;
    maskRef.current.style.backgroundColor = theme.fillColor;
    maskGlowRef.current.style.backgroundColor = theme.fillColor;
    maskGlowRef.current.style.boxShadow = `0 0 90px ${theme.glowColor}`;

    uiRef.current.style.color = theme.textColor;
    uiRef.current.style.setProperty("--loader-text-glow", theme.textGlowColor);

    barTrackRef.current.style.backgroundColor = theme.barTrackColor;
    barRef.current.style.backgroundColor = theme.barFillColor;
  };

  const getClosedCircleFromTopLeft = () => "circle(0px at 0% 0%)";
  const getOpenCircleFromTopLeft = () => "circle(150vmax at 0% 0%)";

  const getClosedCircleFromBottomRight = () => "circle(0px at 100% 100%)";
  const getOpenCircleFromBottomRight = () => "circle(150vmax at 100% 100%)";

  const resetLoaderUI = (labelText: string) => {
    if (
      !uiRef.current ||
      !labelRef.current ||
      !valueRef.current ||
      !barTrackRef.current ||
      !barRef.current
    ) {
      return;
    }

    setLabelText(labelText);
    setCounterText(0);

    gsap.set(uiRef.current, { opacity: 1 });

    gsap.set([labelRef.current, valueRef.current], {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      filter: "blur(0px)",
    });

    gsap.set(barTrackRef.current, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
    });

    gsap.set(barRef.current, {
      scaleX: 0,
      transformOrigin: "left center",
      opacity: 1,
    });
  };

  const hideLoaderUIImmediately = () => {
    if (
      !uiRef.current ||
      !labelRef.current ||
      !valueRef.current ||
      !barTrackRef.current ||
      !barRef.current
    ) {
      return;
    }

    gsap.set(uiRef.current, { opacity: 1 });

    gsap.set([labelRef.current, valueRef.current], {
      opacity: 0,
      y: 14,
      x: 0,
      rotate: 0,
      filter: "blur(3px)",
    });

    gsap.set(barTrackRef.current, {
      opacity: 0,
      y: 14,
      filter: "blur(3px)",
    });

    gsap.set(barRef.current, {
      scaleX: 0,
      transformOrigin: "left center",
      opacity: 1,
    });
  };

  const setMasksTopLeftClosed = () => {
    if (!maskRef.current || !maskGlowRef.current) return;

    gsap.set([maskRef.current, maskGlowRef.current], {
      clipPath: getClosedCircleFromTopLeft(),
      opacity: 1,
    });
  };

  const setMasksTopLeftOpen = () => {
    if (!maskRef.current || !maskGlowRef.current) return;

    gsap.set([maskRef.current, maskGlowRef.current], {
      clipPath: getOpenCircleFromTopLeft(),
      opacity: 1,
    });
  };

  const setMasksBottomRightOpen = () => {
    if (!maskRef.current || !maskGlowRef.current) return;

    gsap.set([maskRef.current, maskGlowRef.current], {
      clipPath: getOpenCircleFromBottomRight(),
      opacity: 1,
    });
  };

  const finishReveal = () => {
    if (
      !overlayRef.current ||
      !maskRef.current ||
      !maskGlowRef.current ||
      !labelRef.current ||
      !valueRef.current ||
      !barTrackRef.current
    ) {
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlayRef.current, {
          opacity: 0,
          pointerEvents: "none",
        });

        gsap.set([maskRef.current, maskGlowRef.current], {
          opacity: 1,
        });

        setMasksTopLeftClosed();
        isBusyRef.current = false;
        pendingHrefRef.current = null;
      },
    });

    tl.to({}, { duration: 0.06 })
      .to([labelRef.current, valueRef.current], {
        keyframes: [
          { x: -4, rotate: -2, duration: 0.03 },
          { x: 4, rotate: 2, duration: 0.03 },
          { x: -2, rotate: -1, duration: 0.03 },
          { x: 0, rotate: 0, duration: 0.02 },
        ],
        ease: "power2.out",
      })
      .to(
        [labelRef.current, valueRef.current],
        {
          y: -18,
          opacity: 0,
          filter: "blur(2px)",
          duration: 0.18,
          ease: "power2.out",
          stagger: 0.02,
        },
        "+=0.01"
      )
      .to(
        barTrackRef.current,
        {
          y: -12,
          opacity: 0,
          filter: "blur(2px)",
          duration: 0.16,
          ease: "power2.out",
        },
        "<+0.01"
      )
      .to({}, { duration: 0.04 })
      .to(
        maskRef.current,
        {
          clipPath: getClosedCircleFromBottomRight(),
          duration: 1.08,
          ease: "power4.in",
        },
        0
      )
      .to(
        maskGlowRef.current,
        {
          clipPath: getClosedCircleFromBottomRight(),
          duration: 1.08,
          ease: "power4.in",
        },
        "<"
      )
      .set(overlayRef.current, {
        opacity: 0,
        pointerEvents: "none",
      });
  };

  const playIntro = () => {
    if (
      !overlayRef.current ||
      !maskRef.current ||
      !maskGlowRef.current ||
      !labelRef.current ||
      !valueRef.current ||
      !barTrackRef.current ||
      !barRef.current
    ) {
      return;
    }

    if (introStartedRef.current) return;
    introStartedRef.current = true;

    const theme = getThemeByHref("/", true);

    isBusyRef.current = true;

    gsap.killTweensOf([
      overlayRef.current,
      maskRef.current,
      maskGlowRef.current,
      labelRef.current,
      valueRef.current,
      barTrackRef.current,
      barRef.current,
    ]);

    applyTheme(theme);

    gsap.set(overlayRef.current, {
      opacity: 1,
      pointerEvents: "auto",
    });

    setMasksTopLeftOpen();
    resetLoaderUI(theme.label);
    hideLoaderUIImmediately();

    const counter = { value: 0 };

    gsap.timeline({
      onComplete: () => {
        hasIntroPlayedRef.current = true;
        finishReveal();
      },
    })
      .to({}, { duration: 0.18 })
      .to(
        [labelRef.current, valueRef.current, barTrackRef.current],
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.32,
          ease: "power2.out",
          stagger: 0.04,
        }
      )
      .to(
        counter,
        {
          value: 100,
          duration: 1.1,
          ease: "none",
          onUpdate: () => {
            setCounterText(counter.value);
          },
        },
        0.45
      )
      .to(
        barRef.current,
        {
          scaleX: 1,
          duration: 1.1,
          ease: "none",
        },
        0.45
      );
  };

  const playCoverAndNavigate = (href: string) => {
    if (
      !overlayRef.current ||
      !maskRef.current ||
      !maskGlowRef.current ||
      !labelRef.current ||
      !valueRef.current ||
      !barTrackRef.current ||
      !barRef.current
    ) {
      return;
    }

    if (isBusyRef.current) return;

    const theme = getThemeByHref(href);

    isBusyRef.current = true;
    pendingHrefRef.current = href;

    gsap.killTweensOf([
      overlayRef.current,
      maskRef.current,
      maskGlowRef.current,
      labelRef.current,
      valueRef.current,
      barTrackRef.current,
      barRef.current,
    ]);

    applyTheme(theme);

    gsap.set(overlayRef.current, {
      opacity: 1,
      pointerEvents: "auto",
    });

    setMasksTopLeftClosed();
    resetLoaderUI(theme.label);
    hideLoaderUIImmediately();

    const counter = { value: 0 };

    gsap.timeline({
      onComplete: () => {
        waitingForRouteRef.current = true;
        router.push(href);
      },
    })
      .to(
        maskRef.current,
        {
          clipPath: getOpenCircleFromTopLeft(),
          duration: 0.96,
          ease: "power4.in",
        },
        0
      )
      .to(
        maskGlowRef.current,
        {
          clipPath: getOpenCircleFromTopLeft(),
          duration: 0.96,
          ease: "power4.in",
        },
        "<"
      )
      .to(
        [labelRef.current, valueRef.current, barTrackRef.current],
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.3,
          ease: "power2.out",
          stagger: 0.04,
        },
        0.12
      )
      .to(
        counter,
        {
          value: 100,
          duration: 0.96,
          ease: "none",
          onUpdate: () => {
            setCounterText(counter.value);
          },
        },
        0.34
      )
      .to(
        barRef.current,
        {
          scaleX: 1,
          duration: 0.96,
          ease: "none",
        },
        0.34
      );
  };

  useEffect(() => {
    playIntro();
  }, []);

  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const customEvent = event as CustomEvent<NavigateEventDetail>;
      const href = customEvent.detail?.href;

      if (!href) return;
      if (getPathKey(href) === pathname) return;

      playCoverAndNavigate(href);
    };

    window.addEventListener("app:navigate", handleNavigate as EventListener);

    return () => {
      window.removeEventListener("app:navigate", handleNavigate as EventListener);
    };
  }, [pathname]);

  useEffect(() => {
    if (!hasIntroPlayedRef.current) return;

    if (waitingForRouteRef.current) {
      waitingForRouteRef.current = false;

      const theme = getThemeByHref(pathname);
      applyTheme(theme);

      setMasksBottomRightOpen();

      window.setTimeout(() => {
        finishReveal();
      }, 120);
    }
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      style={{ opacity: 1, pointerEvents: "auto" }}
      aria-hidden="true"
    >
      <div
        ref={maskGlowRef}
        className={styles.maskGlow}
        style={{
          clipPath: "circle(150vmax at 0% 0%)",
          opacity: 0.46,
        }}
      />

      <div
        ref={maskRef}
        className={styles.mask}
        style={{
          clipPath: "circle(150vmax at 0% 0%)",
          opacity: 1,
        }}
      />

      <div ref={uiRef} className={styles.ui}>
        <p ref={labelRef} className={styles.label}>
          Entering Eunsu World
        </p>

        <p ref={valueRef} className={styles.value}>
          0%
        </p>

        <div ref={barTrackRef} className={styles.barTrack}>
          <div ref={barRef} className={styles.barFill} />
        </div>
      </div>
    </div>
  );
}