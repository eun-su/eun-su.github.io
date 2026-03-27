"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

type NavigateEventDetail = {
  href: string;
};

type TransitionTheme = {
  label: string;
  baseColor: string;
  fillColor: string;
  barTrackColor: string;
};

const LOADER_TEXT_COLOR = "#EAEAF0";
const LOADER_BAR_FILL_COLOR = "#EAEAF0";

const PAGE_THEME_MAP: Record<string, TransitionTheme> = {
  "/": {
    label: "Entering Eunsu World",
    baseColor: "#F8F9FC",
    fillColor: "#1C2F6C",
    barTrackColor: "rgba(234, 234, 240, 0.26)",
  },
  "/intro": {
    label: "Entering Intro",
    baseColor: "#F7F7F7",
    fillColor: "#33456B",
    barTrackColor: "rgba(234, 234, 240, 0.26)",
  },
  "/projects": {
    label: "Entering Projects",
    baseColor: "#F4EFF4",
    fillColor: "#A1002B",
    barTrackColor: "rgba(234, 234, 240, 0.26)",
  },
  "/design": {
    label: "Entering Design Works",
    baseColor: "#FCFCFD",
    fillColor: "#960C24",
    barTrackColor: "rgba(234, 234, 240, 0.26)",
  },
  "/study": {
    label: "Entering Design Works",
    baseColor: "#FCFCFD",
    fillColor: "#960C24",
    barTrackColor: "rgba(234, 234, 240, 0.26)",
  },
  "/issues": {
    label: "Entering Issue Board",
    baseColor: "#F4F6FB",
    fillColor: "#0D1F73",
    barTrackColor: "rgba(234, 234, 240, 0.26)",
  },
  "/favorites": {
    label: "Entering Favorites",
    baseColor: "#F7F6FA",
    fillColor: "#3E4F7D",
    barTrackColor: "rgba(234, 234, 240, 0.26)",
  },
};

const DEFAULT_THEME: TransitionTheme = {
  label: "Loading",
  baseColor: "#F8F9FC",
  fillColor: "#1C2F6C",
  barTrackColor: "rgba(234, 234, 240, 0.26)",
};

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();

  const overlayRef = useRef<HTMLDivElement | null>(null);
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

  const revealAppShell = () => {
    document.body.setAttribute("data-initial-loading", "false");

    const appShell = document.getElementById("app-shell");
    if (appShell) {
      appShell.style.visibility = "visible";
    }
  };

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
      !maskRef.current ||
      !uiRef.current ||
      !labelRef.current ||
      !valueRef.current ||
      !barTrackRef.current ||
      !barRef.current
    ) {
      return;
    }

    overlayRef.current.style.backgroundColor = theme.baseColor;
    maskRef.current.style.backgroundColor = theme.fillColor;

    uiRef.current.style.color = LOADER_TEXT_COLOR;
    uiRef.current.style.textShadow = "none";

    labelRef.current.style.color = LOADER_TEXT_COLOR;
    labelRef.current.style.textShadow = "none";

    valueRef.current.style.color = LOADER_TEXT_COLOR;
    valueRef.current.style.textShadow = "none";

    barTrackRef.current.style.backgroundColor = theme.barTrackColor;
    barRef.current.style.backgroundColor = LOADER_BAR_FILL_COLOR;
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

    gsap.set([labelRef.current, valueRef.current], {
      opacity: 0,
      y: 14,
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

  const setMaskTopLeftClosed = () => {
    if (!maskRef.current) return;
    gsap.set(maskRef.current, {
      clipPath: getClosedCircleFromTopLeft(),
      opacity: 1,
    });
  };

  const setMaskTopLeftOpen = () => {
    if (!maskRef.current) return;
    gsap.set(maskRef.current, {
      clipPath: getOpenCircleFromTopLeft(),
      opacity: 1,
    });
  };

  const setMaskBottomRightOpen = () => {
    if (!maskRef.current) return;
    gsap.set(maskRef.current, {
      clipPath: getOpenCircleFromBottomRight(),
      opacity: 1,
    });
  };

  const finishReveal = (isInitial = false) => {
    if (
      !overlayRef.current ||
      !maskRef.current ||
      !labelRef.current ||
      !valueRef.current ||
      !barTrackRef.current
    ) {
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        if (isInitial) {
          revealAppShell();
        }

        gsap.set(overlayRef.current, {
          opacity: 0,
          pointerEvents: "none",
        });

        setMaskTopLeftClosed();
        isBusyRef.current = false;
      },
    });

    tl.to([labelRef.current, valueRef.current], {
      y: -18,
      opacity: 0,
      filter: "blur(2px)",
      duration: 0.18,
      ease: "power2.out",
      stagger: 0.02,
    })
      .to(
        barTrackRef.current,
        {
          y: -12,
          opacity: 0,
          filter: "blur(2px)",
          duration: 0.16,
          ease: "power2.out",
        },
        "<"
      )
      .to(
        maskRef.current,
        {
          clipPath: getClosedCircleFromBottomRight(),
          duration: 1.12,
          ease: "power4.in",
        },
        0
      );
  };

  const playIntro = () => {
    if (
      !overlayRef.current ||
      !maskRef.current ||
      !labelRef.current ||
      !valueRef.current ||
      !barTrackRef.current ||
      !barRef.current
    ) {
      return;
    }

    if (introStartedRef.current) return;
    introStartedRef.current = true;
    isBusyRef.current = true;

    const theme = getThemeByHref("/", true);
    applyTheme(theme);

    gsap.set(overlayRef.current, {
      opacity: 1,
      pointerEvents: "auto",
    });

    setMaskTopLeftOpen();
    resetLoaderUI(theme.label);
    hideLoaderUIImmediately();

    const counter = { value: 0 };

    gsap.timeline({
      onComplete: () => {
        hasIntroPlayedRef.current = true;
        finishReveal(true);
      },
    })
      .to([labelRef.current, valueRef.current, barTrackRef.current], {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.34,
        ease: "power2.out",
        stagger: 0.04,
      })
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
        0.3
      )
      .to(
        barRef.current,
        {
          scaleX: 1,
          duration: 1.1,
          ease: "none",
        },
        0.3
      );
  };

  const playCoverAndNavigate = (href: string) => {
    if (
      !overlayRef.current ||
      !maskRef.current ||
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
    applyTheme(theme);

    gsap.set(overlayRef.current, {
      opacity: 1,
      pointerEvents: "auto",
    });

    setMaskTopLeftClosed();
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
      setMaskBottomRightOpen();

      window.setTimeout(() => {
        finishReveal(false);
      }, 120);
    }
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        opacity: 1,
        pointerEvents: "auto",
        overflow: "hidden",
        background: "#f8f9fc",
      }}
    >
      <div
        ref={maskRef}
        style={{
          position: "absolute",
          inset: 0,
          background: "#1c2f6c",
          clipPath: "circle(150vmax at 0% 0%)",
          opacity: 1,
        }}
      />

      <div
        ref={uiRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: LOADER_TEXT_COLOR,
          textAlign: "center",
          padding: "1.5rem",
          textShadow: "none",
        }}
      >
        <p
          ref={labelRef}
          style={{
            margin: "0 0 0.75rem",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.24em",
            opacity: 0,
            color: LOADER_TEXT_COLOR,
            textShadow: "none",
          }}
        >
          Entering Eunsu World
        </p>

        <p
          ref={valueRef}
          style={{
            margin: 0,
            fontSize: "clamp(34px, 7vw, 72px)",
            lineHeight: 1,
            letterSpacing: "-0.05em",
            fontWeight: 600,
            opacity: 0,
            color: LOADER_TEXT_COLOR,
            textShadow: "none",
          }}
        >
          0%
        </p>

        <div
          ref={barTrackRef}
          style={{
            width: "220px",
            height: "2px",
            marginTop: "1.25rem",
            background: "rgba(234, 234, 240, 0.26)",
            overflow: "hidden",
            opacity: 0,
            borderRadius: "9999px",
          }}
        >
          <div
            ref={barRef}
            style={{
              width: "100%",
              height: "100%",
              background: LOADER_BAR_FILL_COLOR,
              transformOrigin: "left center",
              transform: "scaleX(0)",
            }}
          />
        </div>
      </div>
    </div>
  );
}