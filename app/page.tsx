"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Header from "@/components/Header";

const sections = [
  {
    id: "hero",
    label: "Hero",
    bg: "bg-neutral-100 text-black",
    title: "Designing calm and intentional digital spaces.",
    desc: "웹 퍼블리싱과 프론트엔드 구현을 바탕으로, 사람의 흐름과 감각을 고려한 화면을 만듭니다.",
  },
  {
    id: "about",
    label: "About",
    bg: "bg-neutral-200 text-black",
    title: "I like building structured and thoughtful interfaces.",
    desc: "공간을 설계하고 구축하는 것을 좋아합니다. 보기 좋은 화면을 넘어서, 사용자의 시선과 경험이 자연스럽게 이어지는 웹을 지향합니다.",
  },
  {
    id: "work",
    label: "Work",
    bg: "bg-neutral-300 text-black",
    title: "Selected work across publishing, renewal, and e-commerce.",
    desc: "홈페이지 구축, 리뉴얼, 쇼핑몰 튜닝, 기능 개발, 검색 연동, 파트너 플랫폼 연결 등 다양한 실무를 경험했습니다.",
  },
  {
    id: "skills",
    label: "Skills",
    bg: "bg-neutral-400 text-black",
    title: "Frontend skills with a publisher’s eye for detail.",
    desc: "HTML, CSS, JavaScript, React, UI 구현, 반응형 작업, 인터랙션 설계에 강점을 가지고 있습니다.",
  },
  {
    id: "philosophy",
    label: "Philosophy",
    bg: "bg-neutral-500 text-white",
    title: "Less noise, more rhythm, more clarity.",
    desc: "강한 인상을 주되 과하지 않은 구성, 넓은 여백, 절제된 움직임, 그리고 읽기 좋은 구조를 중요하게 생각합니다.",
  },
  {
    id: "contact",
    label: "Contact",
    bg: "bg-neutral-900 text-white",
    title: "Let’s build something meaningful.",
    desc: "차분하지만 인상 깊은 화면, 구조가 분명한 웹 경험, 그리고 더 나은 인터랙션을 함께 만들고 싶습니다.",
  },
];

const WHEEL_THRESHOLD = 45;
const WHEEL_IDLE_RESET_MS = 160;
const POST_ANIMATION_COOLDOWN_MS = 120;

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const wheelAccumulatorRef = useRef(0);
  const wheelResetTimerRef = useRef<number | null>(null);
  const lockUntilRef = useRef(0);

  const [currentIndex, setCurrentIndex] = useState(0);

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

  const goToSection = (nextIndex: number) => {
    const container = containerRef.current;
    const targetSection = sectionRefs.current[nextIndex];

    if (!container || !targetSection) return;
    if (nextIndex < 0 || nextIndex >= sections.length) return;
    if (isAnimatingRef.current) return;
    if (nextIndex === currentIndexRef.current) return;

    isAnimatingRef.current = true;
    resetWheelAccumulator();

    gsap.killTweensOf(container);

    gsap.to(container, {
      scrollTop: targetSection.offsetTop,
      duration: 0.95,
      ease: "power3.inOut",
      onComplete: () => {
        currentIndexRef.current = nextIndex;
        setCurrentIndex(nextIndex);
        isAnimatingRef.current = false;
        resetWheelAccumulator();
        lockUntilRef.current = Date.now() + POST_ANIMATION_COOLDOWN_MS;
      },
    });
  };

  const handleNavigateById = (sectionId: string) => {
    const nextIndex = sections.findIndex((section) => section.id === sectionId);
    if (nextIndex === -1) return;
    goToSection(nextIndex);
  };

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
      const nextIndex = currentIndexRef.current + direction;

      resetWheelAccumulator();

      if (nextIndex < 0 || nextIndex >= sections.length) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      goToSection(nextIndex);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (window.innerWidth < 768) return;
      if (Date.now() < lockUntilRef.current) return;
      if (isAnimatingRef.current) return;

      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        goToSection(currentIndexRef.current + 1);
      }

      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goToSection(currentIndexRef.current - 1);
      }

      if (e.key === "Home") {
        e.preventDefault();
        goToSection(0);
      }

      if (e.key === "End") {
        e.preventDefault();
        goToSection(sections.length - 1);
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

      const direction = deltaY > 0 ? 1 : -1;
      const nextIndex = currentIndexRef.current + direction;

      goToSection(nextIndex);
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
    <main className="relative h-[100dvh] overflow-hidden">
      <Header onNavigate={handleNavigateById} />

      <div ref={containerRef} id="top" className="h-[100dvh] overflow-y-auto">
        {sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
            className={`relative flex min-h-[100dvh] items-end px-6 py-10 md:px-10 md:py-14 ${section.bg}`}
          >
            <div className="w-full">
              <div className="mb-6 md:mb-8">
                <p className="text-xs uppercase tracking-[0.22em] opacity-70 md:text-sm">
                  {section.label}
                </p>
              </div>

              <div className="max-w-6xl">
                <h2 className="max-w-5xl text-[40px] leading-[0.95] tracking-[-0.04em] md:text-[96px]">
                  {section.title}
                </h2>

                <p className="mt-6 max-w-2xl text-base leading-[1.7] opacity-80 md:mt-8 md:text-xl">
                  {section.desc}
                </p>
              </div>

              <div className="absolute bottom-8 right-6 text-xs uppercase tracking-[0.18em] opacity-40 md:right-10">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(sections.length).padStart(2, "0")}
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.18em] backdrop-blur-md">
        {String(currentIndex + 1).padStart(2, "0")} /{" "}
        {String(sections.length).padStart(2, "0")}
      </div>
    </main>
  );
}