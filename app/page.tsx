"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Header from "@/components/Header";
import { usePageTheme } from "@/hooks/usePageTheme";
import { homeProjectCards, homeSections } from "@/data/homeSections";
import HomeSectionShell from "@/components/home/HomeSectionShell";
import HomeSectionRenderer from "@/components/home/HomeSectionRenderer";
import styles from "./HomePage.module.scss";

const WHEEL_THRESHOLD = 45;
const WHEEL_IDLE_RESET_MS = 160;
const POST_ANIMATION_COOLDOWN_MS = 120;

export default function Home() {
  usePageTheme("home");

  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const projectTrackRef = useRef<HTMLDivElement | null>(null);

  const currentSectionRef = useRef(0);
  const currentProjectCardRef = useRef(0);

  const isAnimatingRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const wheelAccumulatorRef = useRef(0);
  const wheelResetTimerRef = useRef<number | null>(null);
  const lockUntilRef = useRef(0);

  const [currentSection, setCurrentSection] = useState(0);
  const [currentProjectCard, setCurrentProjectCard] = useState(0);

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

    window.dispatchEvent(
      new CustomEvent("app:navigate", {
        detail: { href },
      })
    );
  };

  const getProjectCards = () => {
    if (!projectTrackRef.current) return [];
    return Array.from(
      projectTrackRef.current.querySelectorAll<HTMLElement>("[data-project-card]")
    );
  };

  /**
   * 정지 상태 기준 포즈
   * - active만 보임
   * - 나머지는 뒤에 있으면서 opacity 0
   */
  const getRestPose = (cardIndex: number, activeIndex: number) => {
    const delta = cardIndex - activeIndex;

    if (delta === 0) {
      return {
        xPercent: 0,
        y: 0,
        z: 0,
        rotateY: 0,
        rotateZ: 0,
        scale: 1,
        opacity: 1,
        zIndex: 40,
      };
    }

    if (delta > 0) {
      return {
        xPercent: 14,
        y: 14,
        z: -260,
        rotateY: -24,
        rotateZ: -1.2,
        scale: 0.94,
        opacity: 0,
        zIndex: 10,
      };
    }

    return {
      xPercent: -14,
      y: 14,
      z: -260,
      rotateY: 24,
      rotateZ: 1.2,
      scale: 0.94,
      opacity: 0,
      zIndex: 10,
    };
  };

  /**
   * 전환 직전 다음/이전 카드가 잠깐 보일 때의 pose
   * activeIndex로 바로 두지 않고, entering 방향에 따라 시작 포즈를 잡습니다.
   */
  const getEnteringPose = (direction: 1 | -1) => {
    if (direction === 1) {
      return {
        xPercent: 18,
        y: 18,
        z: -220,
        rotateY: -28,
        rotateZ: -1.6,
        scale: 0.93,
        opacity: 0,
        zIndex: 30,
      };
    }

    return {
      xPercent: -18,
      y: 18,
      z: -220,
      rotateY: 28,
      rotateZ: 1.6,
      scale: 0.93,
      opacity: 0,
      zIndex: 30,
    };
  };

  const getExitingPose = (direction: 1 | -1) => {
    if (direction === 1) {
      return {
        xPercent: -16,
        y: 18,
        z: -180,
        rotateY: 20,
        rotateZ: 1.2,
        scale: 0.94,
        opacity: 0,
        zIndex: 20,
      };
    }

    return {
      xPercent: 16,
      y: 18,
      z: -180,
      rotateY: -20,
      rotateZ: -1.2,
      scale: 0.94,
      opacity: 0,
      zIndex: 20,
    };
  };

  const setProjectCardsImmediately = (activeIndex: number) => {
    const cards = getProjectCards();
    if (!cards.length) return;

    cards.forEach((card, index) => {
      const pose = getRestPose(index, activeIndex);

      gsap.set(card, {
        xPercent: pose.xPercent,
        y: pose.y,
        z: pose.z,
        rotateY: pose.rotateY,
        rotateZ: pose.rotateZ,
        scale: pose.scale,
        opacity: pose.opacity,
        zIndex: pose.zIndex,
        transformOrigin: "center center",
        pointerEvents: index === activeIndex ? "auto" : "none",
        force3D: true,
      });
    });
  };

  const animateProjectCards = (nextCardIndex: number) => {
    const cards = getProjectCards();
    if (!cards.length) return;

    const prevCardIndex = currentProjectCardRef.current;
    const direction: 1 | -1 = nextCardIndex > prevCardIndex ? 1 : -1;

    const prevCard = cards[prevCardIndex];
    const nextCard = cards[nextCardIndex];

    if (!prevCard || !nextCard) return;

    isAnimatingRef.current = true;
    resetWheelAccumulator();

    const enteringPose = getEnteringPose(direction);
    const exitingPose = getExitingPose(direction);

    // 들어올 카드는 뒤쪽에서 완전 투명 상태로 시작
    gsap.set(nextCard, {
      xPercent: enteringPose.xPercent,
      y: enteringPose.y,
      z: enteringPose.z,
      rotateY: enteringPose.rotateY,
      rotateZ: enteringPose.rotateZ,
      scale: enteringPose.scale,
      opacity: 0,
      zIndex: 30,
      pointerEvents: "none",
      force3D: true,
    });

    // 나머지 카드는 항상 완전 숨김
    cards.forEach((card, index) => {
      if (index !== prevCardIndex && index !== nextCardIndex) {
        const hiddenPose = getRestPose(index, nextCardIndex);
        gsap.set(card, {
          xPercent: hiddenPose.xPercent,
          y: hiddenPose.y,
          z: hiddenPose.z,
          rotateY: hiddenPose.rotateY,
          rotateZ: hiddenPose.rotateZ,
          scale: hiddenPose.scale,
          opacity: 0,
          zIndex: 10,
          pointerEvents: "none",
          force3D: true,
        });
      }
    });

    const tl = gsap.timeline({
      defaults: {
        duration: 0.82,
        ease: "power3.inOut",
      },
      onComplete: () => {
        currentProjectCardRef.current = nextCardIndex;
        setCurrentProjectCard(nextCardIndex);
        setProjectCardsImmediately(nextCardIndex);
        isAnimatingRef.current = false;
        lockUntilRef.current = Date.now() + POST_ANIMATION_COOLDOWN_MS;
      },
    });

    // 현재 카드: 앞으로 있던 상태에서 뒤로 빠지며 사라짐
    tl.to(
      prevCard,
      {
        xPercent: exitingPose.xPercent,
        y: exitingPose.y,
        z: exitingPose.z,
        rotateY: exitingPose.rotateY,
        rotateZ: exitingPose.rotateZ,
        scale: exitingPose.scale,
        opacity: 0,
        zIndex: 20,
        pointerEvents: "none",
        force3D: true,
      },
      0
    );

    // 다음 카드: 뒤에서 앞으로 오며 등장
    tl.to(
      nextCard,
      {
        xPercent: 0,
        y: 0,
        z: 0,
        rotateY: 0,
        rotateZ: 0,
        scale: 1,
        opacity: 1,
        zIndex: 40,
        pointerEvents: "auto",
        force3D: true,
      },
      0.04
    );
  };

  const goToSection = (nextIndex: number) => {
    const container = containerRef.current;
    const targetSection = sectionRefs.current[nextIndex];

    if (!container || !targetSection) return;
    if (nextIndex < 0 || nextIndex >= homeSections.length) return;
    if (isAnimatingRef.current) return;
    if (nextIndex === currentSectionRef.current) return;

    isAnimatingRef.current = true;
    resetWheelAccumulator();

    gsap.killTweensOf(container);

    gsap.to(container, {
      scrollTop: targetSection.offsetTop,
      duration: 0.95,
      ease: "power3.inOut",
      onComplete: () => {
        currentSectionRef.current = nextIndex;
        setCurrentSection(nextIndex);
        isAnimatingRef.current = false;
        lockUntilRef.current = Date.now() + POST_ANIMATION_COOLDOWN_MS;
      },
    });
  };

  const handleForward = () => {
    const currentSectionIndex = currentSectionRef.current;
    const currentSectionData = homeSections[currentSectionIndex];

    if (currentSectionData.id === "project-board") {
      if (currentProjectCardRef.current < homeProjectCards.length - 1) {
        animateProjectCards(currentProjectCardRef.current + 1);
        return;
      }
    }

    goToSection(currentSectionIndex + 1);
  };

  const handleBackward = () => {
    const currentSectionIndex = currentSectionRef.current;
    const currentSectionData = homeSections[currentSectionIndex];

    if (currentSectionData.id === "project-board") {
      if (currentProjectCardRef.current > 0) {
        animateProjectCards(currentProjectCardRef.current - 1);
        return;
      }
    }

    if (
      currentSectionIndex === 2 &&
      homeSections[currentSectionIndex - 1]?.id === "project-board"
    ) {
      goToSection(1);

      window.setTimeout(() => {
        currentProjectCardRef.current = homeProjectCards.length - 1;
        setCurrentProjectCard(homeProjectCards.length - 1);
        setProjectCardsImmediately(homeProjectCards.length - 1);
      }, 980);

      return;
    }

    goToSection(currentSectionIndex - 1);
  };

  const handleNavigateById = (sectionId: string) => {
    const nextIndex = homeSections.findIndex((section) => section.id === sectionId);
    if (nextIndex === -1) return;

    if (sectionId === "project-board") {
      currentProjectCardRef.current = 0;
      setCurrentProjectCard(0);

      window.requestAnimationFrame(() => {
        setProjectCardsImmediately(0);
      });
    }

    goToSection(nextIndex);
  };

  useEffect(() => {
    window.requestAnimationFrame(() => {
      setProjectCardsImmediately(0);
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth < 768) return;

      if (Date.now() < lockUntilRef.current) {
        e.preventDefault();
        return;
      }

      if (isAnimatingRef.current) {
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

      if (direction > 0) {
        handleForward();
      } else {
        handleBackward();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (window.innerWidth < 768) return;
      if (Date.now() < lockUntilRef.current) return;
      if (isAnimatingRef.current) return;

      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        handleForward();
      }

      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        handleBackward();
      }

      if (e.key === "Home") {
        e.preventDefault();
        handleNavigateById("hero");
      }

      if (e.key === "End") {
        e.preventDefault();
        goToSection(homeSections.length - 1);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (window.innerWidth >= 768) return;
      if (Date.now() < lockUntilRef.current) return;
      if (isAnimatingRef.current) return;
      if (touchStartYRef.current === null) return;

      const endY = e.changedTouches[0].clientY;
      const deltaY = touchStartYRef.current - endY;

      if (Math.abs(deltaY) < 50) return;

      if (deltaY > 0) {
        handleForward();
      } else {
        handleBackward();
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);

      if (wheelResetTimerRef.current) {
        window.clearTimeout(wheelResetTimerRef.current);
      }
    };
  }, []);

  return (
    <main className={styles.main}>
      <Header onNavigate={handleNavigateById} />

      <div ref={containerRef} id="top" className={styles.container}>
        {homeSections.map((section, index) => {
          const isProjectSection = section.id === "project-board";

          return (
            <HomeSectionShell
              key={section.id}
              id={section.id}
              eyebrow={section.eyebrow}
              sectionNumber={`${String(index + 1).padStart(2, "0")} / ${String(
                homeSections.length
              ).padStart(2, "0")}`}
              className={isProjectSection ? styles.sectionProject : ""}
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
          );
        })}
      </div>

      <div className={styles.progressPill}>
        {currentSection === 1
          ? `${String(currentSection + 1).padStart(2, "0")}-${String(
              currentProjectCard + 1
            ).padStart(2, "0")}`
          : `${String(currentSection + 1).padStart(2, "0")} / ${String(
              homeSections.length
            ).padStart(2, "0")}`}
      </div>
    </main>
  );
}