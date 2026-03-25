"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Header from "@/components/Header";
import HomeSectionRenderer from "@/components/home/HomeSectionRenderer";
import HomeSectionShell from "@/components/home/HomeSectionShell";
import { homeProjectCards, homeSections } from "@/data/homeSections";
import { usePageTheme } from "@/hooks/usePageTheme";
import styles from "./HomePage.module.scss";

const WHEEL_THRESHOLD = 45;
const WHEEL_IDLE_RESET_MS = 160;
const POST_ANIMATION_COOLDOWN_MS = 120;
const CARD_SWIPE_THRESHOLD = 50;
const CARD_TRANSITION_COOLDOWN_MS = 420;
const CARDS_SECTION_INDEX = homeSections.findIndex((section) => section.mode === "cards");

export default function Home() {
  usePageTheme("home");

  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const projectTrackRef = useRef<HTMLDivElement | null>(null);

  const currentSectionRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const wheelAccumulatorRef = useRef(0);
  const wheelResetTimerRef = useRef<number | null>(null);
  const lockUntilRef = useRef(0);

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const [currentSection, setCurrentSection] = useState(0);
  const [currentProjectCard, setCurrentProjectCard] = useState(0);

  const maxProjectCardIndex = Math.max(homeProjectCards.length - 1, 0);

  const resetWheelAccumulator = () => {
    wheelAccumulatorRef.current = 0;

    if (wheelResetTimerRef.current) {
      window.clearTimeout(wheelResetTimerRef.current);
      wheelResetTimerRef.current = null;
    }
  };

  const scheduleWheelAccumulatorReset = () => {
    if (wheelResetTimerRef.current) {
      window.clearTimeout(wheelResetTimerRef.current);
    }

    wheelResetTimerRef.current = window.setTimeout(() => {
      wheelAccumulatorRef.current = 0;
      wheelResetTimerRef.current = null;
    }, WHEEL_IDLE_RESET_MS);
  };

  const triggerPageTransition = (href?: string) => {
    if (!href) return;
    window.dispatchEvent(new CustomEvent("app:navigate", { detail: { href } }));
  };

  const syncProjectTrack = (nextCardIndex: number, instant = false) => {
    const track = projectTrackRef.current;
    if (!track) return;

    const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-project-card]"));
    if (!cards.length) return;

    cards.forEach((card, index) => {
      const offset = index - nextCardIndex;
      const abs = Math.abs(offset);
      const hidden = abs > 2;
      const x = offset * 168;
      const y = abs * 12;
      const z = offset === 0 ? 0 : -abs * 180;
      const scale = offset === 0 ? 1 : Math.max(0.84, 1 - abs * 0.08);
      const rotateY = offset === 0 ? 0 : offset > 0 ? -14 : 14;
      const opacity = hidden ? 0 : offset === 0 ? 1 : abs === 1 ? 0.72 : 0.3;
      const body = card.querySelector<HTMLElement>("[class*='projectCardBody']");

      gsap.killTweensOf(card);
      gsap.to(card, {
        x,
        y,
        z,
        scale,
        opacity,
        rotateY,
        rotateZ: 0,
        zIndex: 100 - abs,
        duration: instant ? 0 : 0.58,
        ease: instant ? "none" : "power3.inOut",
        overwrite: true,
      });

      if (body) {
        gsap.killTweensOf(body);
        gsap.to(body, {
          opacity: offset === 0 ? 1 : 0,
          y: offset === 0 ? 0 : 10,
          duration: instant ? 0 : 0.28,
          ease: instant ? "none" : "power2.out",
          overwrite: true,
        });
      }
    });
  };

  const goToProjectCard = (nextCardIndex: number, instant = false) => {
    const clampedIndex = Math.max(0, Math.min(maxProjectCardIndex, nextCardIndex));
    setCurrentProjectCard(clampedIndex);
    lockUntilRef.current = Date.now() + (instant ? 0 : CARD_TRANSITION_COOLDOWN_MS);
    syncProjectTrack(clampedIndex, instant);
  };

  const goToSection = (nextIndex: number, instant = false) => {
    const container = containerRef.current;
    const targetSection = sectionRefs.current[nextIndex];

    if (!container || !targetSection) return;
    if (nextIndex < 0 || nextIndex >= homeSections.length) return;
    if (!instant && isAnimatingRef.current) return;
    if (!instant && nextIndex === currentSectionRef.current) return;

    const targetOffset = targetSection.offsetTop;

    isAnimatingRef.current = true;
    resetWheelAccumulator();
    gsap.killTweensOf(container);

    gsap.to(container, {
      scrollTop: targetOffset,
      duration: instant ? 0 : 0.96,
      ease: instant ? "none" : "power2.inOut",
      onComplete: () => {
        container.scrollTop = targetOffset;
        currentSectionRef.current = nextIndex;
        setCurrentSection(nextIndex);
        isAnimatingRef.current = false;
        lockUntilRef.current = Date.now() + POST_ANIMATION_COOLDOWN_MS;

        const nextId = homeSections[nextIndex]?.id;
        if (nextId) {
          history.replaceState(null, "", `/#${nextId}`);
        }
      },
    });
  };

  const handleForward = () => {
    if (currentSectionRef.current === CARDS_SECTION_INDEX && currentProjectCard < maxProjectCardIndex) {
      goToProjectCard(currentProjectCard + 1);
      return;
    }

    goToSection(currentSectionRef.current + 1);
  };

  const handleBackward = () => {
    if (currentSectionRef.current === CARDS_SECTION_INDEX && currentProjectCard > 0) {
      goToProjectCard(currentProjectCard - 1);
      return;
    }

    goToSection(currentSectionRef.current - 1);
  };

  const handleNavigateById = (sectionId: string) => {
    const nextIndex = homeSections.findIndex((section) => section.id === sectionId);
    if (nextIndex === -1) return;
    goToSection(nextIndex);
  };

  useEffect(() => {
    const initialHash = window.location.hash.replace("#", "");
    const initialIndex = homeSections.findIndex((section) => section.id === initialHash);

    window.requestAnimationFrame(() => {
      if (initialIndex >= 0) {
        goToSection(initialIndex, true);
      } else {
        goToSection(0, true);
      }

      goToProjectCard(0, true);
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      syncProjectTrack(currentProjectCard, true);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentProjectCard]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Date.now() < lockUntilRef.current || isAnimatingRef.current) {
        e.preventDefault();
        return;
      }

      wheelAccumulatorRef.current += e.deltaY;
      scheduleWheelAccumulatorReset();

      if (Math.abs(wheelAccumulatorRef.current) < WHEEL_THRESHOLD) {
        e.preventDefault();
        return;
      }

      const direction = wheelAccumulatorRef.current > 0 ? 1 : -1;
      resetWheelAccumulator();
      e.preventDefault();

      if (direction > 0) handleForward();
      else handleBackward();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (Date.now() < lockUntilRef.current || isAnimatingRef.current) return;

      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        handleForward();
      }

      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        handleBackward();
      }

      if (e.key === "ArrowRight" && currentSectionRef.current === CARDS_SECTION_INDEX) {
        e.preventDefault();
        if (currentProjectCard < maxProjectCardIndex) {
          goToProjectCard(currentProjectCard + 1);
        }
      }

      if (e.key === "ArrowLeft" && currentSectionRef.current === CARDS_SECTION_INDEX) {
        e.preventDefault();
        if (currentProjectCard > 0) {
          goToProjectCard(currentProjectCard - 1);
        }
      }

      if (e.key === "Home") {
        e.preventDefault();
        handleNavigateById(homeSections[0].id);
      }

      if (e.key === "End") {
        e.preventDefault();
        goToSection(homeSections.length - 1);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (Date.now() < lockUntilRef.current || isAnimatingRef.current) return;
      if (touchStartXRef.current === null || touchStartYRef.current === null) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const deltaX = touchStartXRef.current - endX;
      const deltaY = touchStartYRef.current - endY;

      touchStartXRef.current = null;
      touchStartYRef.current = null;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (
        currentSectionRef.current === CARDS_SECTION_INDEX &&
        absX > absY &&
        absX > CARD_SWIPE_THRESHOLD
      ) {
        if (deltaX > 0 && currentProjectCard < maxProjectCardIndex) {
          goToProjectCard(currentProjectCard + 1);
          return;
        }

        if (deltaX < 0 && currentProjectCard > 0) {
          goToProjectCard(currentProjectCard - 1);
          return;
        }
      }

      if (absY < 50) return;

      if (deltaY > 0) handleForward();
      else handleBackward();
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);

      if (wheelResetTimerRef.current) {
        window.clearTimeout(wheelResetTimerRef.current);
      }
    };
  }, [currentProjectCard, maxProjectCardIndex]);

  return (
    <main className={styles.main}>
      <Header onNavigate={handleNavigateById} />

      <div ref={containerRef} id="top" className={styles.container}>
        {homeSections.map((section, index) => (
          <HomeSectionShell
            key={section.id}
            id={section.id}
            eyebrow={section.mode === "cover" ? "" : section.eyebrow}
            sectionNumber={`${String(index + 1).padStart(2, "0")} / ${String(
              homeSections.length
            ).padStart(2, "0")}`}
            className={index === currentSection ? styles.sectionActive : ""}
            sectionRef={(el) => {
              sectionRefs.current[index] = el;
            }}
          >
            <HomeSectionRenderer
              section={section}
              cards={homeProjectCards}
              currentProjectCard={currentProjectCard}
              projectTrackRef={projectTrackRef}
              onCtaClick={triggerPageTransition}
            />
          </HomeSectionShell>
        ))}
      </div>

      <div className={styles.progressPill}>
        {`${String(currentSection + 1).padStart(2, "0")} / ${String(homeSections.length).padStart(
          2,
          "0"
        )}`}
      </div>
    </main>
  );
}
