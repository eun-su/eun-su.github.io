"use client";

import { useLayoutEffect, useRef } from "react";
import Header from "@/components/Header";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// O 원형 SVG를 렌더링한다
function OMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 240" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="
          M 120 22
          A 98 98 0 1 1 120 218
          A 98 98 0 1 1 120 22
          Z
          M 120 64
          A 56 56 0 1 0 120 176
          A 56 56 0 1 0 120 64
          Z
        "
      />
    </svg>
  );
}

export default function IntroPage() {
  const pageRef = useRef<HTMLDivElement | null>(null);

  // 항상 떠 있는 O를 참조한다
  const floatingORef = useRef<HTMLDivElement | null>(null);

  // O 옆 기본 단어를 참조한다
  const floatingWordRef = useRef<HTMLDivElement | null>(null);

  // 마지막 섹션에서 O 왼쪽에 붙는 텍스트를 참조한다
  const finalLeftWordRef = useRef<HTMLDivElement | null>(null);

  // 마지막 섹션에서 O 오른쪽에 붙는 텍스트를 참조한다
  const finalRightWordRef = useRef<HTMLDivElement | null>(null);

  // 각 섹션과 전환 구간을 참조한다
  const introRef = useRef<HTMLElement | null>(null);
  const transition12Ref = useRef<HTMLElement | null>(null);
  const section2Ref = useRef<HTMLElement | null>(null);
  const transition23Ref = useRef<HTMLElement | null>(null);
  const section3Ref = useRef<HTMLElement | null>(null);
  const transition34Ref = useRef<HTMLElement | null>(null);
  const section4Ref = useRef<HTMLElement | null>(null);
  const transition45Ref = useRef<HTMLElement | null>(null);
  const section5Ref = useRef<HTMLElement | null>(null);

  // 섹션별 콘텐츠 박스를 참조한다
  const section2ContentRef = useRef<HTMLDivElement | null>(null);
  const section3ContentRef = useRef<HTMLDivElement | null>(null);
  const section4ContentRef = useRef<HTMLDivElement | null>(null);
  const section5ContentRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (
      !pageRef.current ||
      !floatingORef.current ||
      !floatingWordRef.current ||
      !finalLeftWordRef.current ||
      !finalRightWordRef.current ||
      !transition12Ref.current ||
      !section2ContentRef.current ||
      !transition23Ref.current ||
      !section3ContentRef.current ||
      !transition34Ref.current ||
      !section4ContentRef.current ||
      !transition45Ref.current ||
      !section5ContentRef.current
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      // O 옆 단어 전환 모션을 처리한다
      const applyWordMorph = (
        progress: number,
        oldText: string,
        newText: string
      ) => {
        if (progress < 0.5) {
          const p = progress / 0.5;
          floatingWord.textContent = oldText;

          gsap.set(floatingWord, {
            x: p * 34,
            opacity: 1 - p,
            filter: `blur(${p * 8}px)`,
          });
        } else {
          const p = (progress - 0.5) / 0.5;

          if (!newText) {
            gsap.set(floatingWord, {
              opacity: 0,
              x: 0,
              filter: "blur(0px)",
            });
            return;
          }

          floatingWord.textContent = newText;

          gsap.set(floatingWord, {
            x: -34 + p * 34,
            opacity: p,
            filter: `blur(${(1 - p) * 8}px)`,
          });
        }
      };

      const floatingO = floatingORef.current!;
      const floatingWord = floatingWordRef.current!;
      const finalLeftWord = finalLeftWordRef.current!;
      const finalRightWord = finalRightWordRef.current!;
      const section2Content = section2ContentRef.current!;
      const section3Content = section3ContentRef.current!;
      const section4Content = section4ContentRef.current!;
      const section5Content = section5ContentRef.current!;

      // 전체 레이아웃과 애니메이션을 다시 세팅한다
      const build = () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // O 시작 크기를 세팅한다
        const oSizeStart = Math.min(Math.max(vw * 0.143, 120), 195);

        // 일반 섹션용 O 크기를 세팅한다
        const oSize = Math.min(Math.max(vw * 0.095, 82), 128);

        // 마지막 섹션용 O 크기를 세팅한다
        const oSizeEnd = Math.min(Math.max(vw * 0.082, 74), 110);

        // O 위치를 섹션별로 세팅한다
        const pos1 = { x: vw * 0.25, y: vh * 0.5, size: oSizeStart };
        const pos2 = { x: vw * 0.19, y: vh * 0.54, size: oSize };
        const pos3 = { x: vw * 0.60, y: vh * 0.52, size: oSize };
        const pos4 = { x: vw * 0.24, y: vh * 0.5, size: oSize };
        const pos5 = { x: vw * 0.5, y: vh * 0.5, size: oSizeEnd };

        gsap.killTweensOf([
          floatingO,
          floatingWord,
          finalLeftWord,
          finalRightWord,
          section2Content,
          section3Content,
          section4Content,
          section5Content,
        ]);

        // O 초기 위치를 세팅한다
        gsap.set(floatingO, {
          left: 0,
          top: 0,
          xPercent: -50,
          yPercent: -50,
          x: pos1.x,
          y: pos1.y,
          width: pos1.size,
          height: pos1.size,
          rotation: 0,
          opacity: 1,
        });

        // O 옆 단어 초기 위치를 세팅한다
        gsap.set(floatingWord, {
          left: pos1.x + pos1.size * 0.42,
          top: pos1.y,
          xPercent: 0,
          yPercent: -50,
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
        });

        floatingWord.textContent = "-LAT";

        // 마지막 섹션 전용 좌우 텍스트 초기 상태를 세팅한다
        gsap.set(finalLeftWord, {
          left: pos5.x - pos5.size * 0.9,
          top: pos5.y,
          xPercent: -100,
          yPercent: -50,
          opacity: 0,
          x: -30,
          filter: "blur(8px)",
        });

        gsap.set(finalRightWord, {
          left: pos5.x + pos5.size * 0.9,
          top: pos5.y,
          xPercent: 0,
          yPercent: -50,
          opacity: 0,
          x: 30,
          filter: "blur(8px)",
        });

        // 다음 섹션 텍스트 초기 상태를 세팅한다
        gsap.set(section2Content, { opacity: 0, x: -120, y: 18, filter: "blur(8px)" });
        gsap.set(section3Content, { opacity: 0, x: -120, y: 18, filter: "blur(8px)" });
        gsap.set(section4Content, { opacity: 0, x: -120, y: 18, filter: "blur(8px)" });
        gsap.set(section5Content, { opacity: 0, x: -120, y: 18, filter: "blur(8px)" });

        // 1 -> 2 전환을 처리한다
        gsap.timeline({
          scrollTrigger: {
            trigger: transition12Ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            onUpdate: (self) => {
              applyWordMorph(self.progress, "-LAT", "bserve");
            },
          },
        })
          .to(
            floatingO,
            {
              motionPath: {
                path: [
                  { x: pos1.x, y: pos1.y },
                  { x: pos1.x + (pos2.x - pos1.x) * 0.42, y: pos1.y + 6 },
                  { x: pos1.x + (pos2.x - pos1.x) * 0.8, y: pos2.y - 4 },
                  { x: pos2.x, y: pos2.y },
                ],
              } as any,
              width: pos2.size,
              height: pos2.size,
              rotation: -10,
              ease: "none",
            },
            0
          )
          .to(
            floatingWord,
            {
              left: pos2.x + pos2.size * 0.38,
              top: pos2.y,
              ease: "none",
            },
            0
          )
          .to(
            section2Content,
            {
              opacity: 1,
              x: 0,
              y: 0,
              filter: "blur(0px)",
              ease: "none",
            },
            0.18
          );

        // 2 -> 3 전환을 처리한다
        gsap.timeline({
          scrollTrigger: {
            trigger: transition23Ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            onUpdate: (self) => {
              applyWordMorph(self.progress, "bserve", "rganize");
            },
          },
        })
          .to(
            floatingO,
            {
              motionPath: {
                path: [
                  { x: pos2.x, y: pos2.y },
                  { x: pos2.x + (pos3.x - pos2.x) * 0.38, y: pos2.y + 6 },
                  { x: pos2.x + (pos3.x - pos2.x) * 0.8, y: pos3.y - 4 },
                  { x: pos3.x, y: pos3.y },
                ],
              } as any,
              width: pos3.size,
              height: pos3.size,
              rotation: 14,
              ease: "none",
            },
            0
          )
          .to(
            floatingWord,
            {
              left: pos3.x + pos3.size * 0.38,
              top: pos3.y,
              ease: "none",
            },
            0
          )
          .to(
            section2Content,
            {
              opacity: 0,
              x: 110,
              y: -10,
              filter: "blur(8px)",
              ease: "none",
            },
            0.05
          )
          .to(
            section3Content,
            {
              opacity: 1,
              x: 0,
              y: 0,
              filter: "blur(0px)",
              ease: "none",
            },
            0.22
          );

        // 3 -> 4 전환을 처리한다
        gsap.timeline({
          scrollTrigger: {
            trigger: transition34Ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            onUpdate: (self) => {
              applyWordMorph(self.progress, "rganize", "pen");
            },
          },
        })
          .to(
            floatingO,
            {
              motionPath: {
                path: [
                  { x: pos3.x, y: pos3.y },
                  { x: pos3.x + (pos4.x - pos3.x) * 0.4, y: pos3.y + 8 },
                  { x: pos3.x + (pos4.x - pos3.x) * 0.82, y: pos4.y - 4 },
                  { x: pos4.x, y: pos4.y },
                ],
              } as any,
              width: pos4.size,
              height: pos4.size,
              rotation: -14,
              ease: "none",
            },
            0
          )
          .to(
            floatingWord,
            {
              left: pos4.x + pos4.size * 0.38,
              top: pos4.y,
              ease: "none",
            },
            0
          )
          .to(
            section3Content,
            {
              opacity: 0,
              x: 110,
              y: -10,
              filter: "blur(8px)",
              ease: "none",
            },
            0.05
          )
          .to(
            section4Content,
            {
              opacity: 1,
              x: 0,
              y: 0,
              filter: "blur(0px)",
              ease: "none",
            },
            0.22
          );

        // 4 -> 5 전환을 처리한다
        gsap.timeline({
          scrollTrigger: {
            trigger: transition45Ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        })
          .to(
            floatingO,
            {
              motionPath: {
                path: [
                  { x: pos4.x, y: pos4.y },
                  { x: pos4.x + (pos5.x - pos4.x) * 0.4, y: pos4.y + 4 },
                  { x: pos4.x + (pos5.x - pos4.x) * 0.82, y: pos5.y - 2 },
                  { x: pos5.x, y: pos5.y },
                ],
              } as any,
              width: pos5.size,
              height: pos5.size,
              rotation: 0,
              ease: "none",
            },
            0
          )
          .to(
            floatingWord,
            {
              // 마지막에는 기존 단어를 숨긴다
              opacity: 0,
              x: 24,
              filter: "blur(8px)",
              ease: "none",
            },
            0.05
          )
          .to(
            section4Content,
            {
              opacity: 0,
              x: 110,
              y: -10,
              filter: "blur(8px)",
              ease: "none",
            },
            0.05
          )
          .to(
            section5Content,
            {
              opacity: 1,
              x: 0,
              y: 0,
              filter: "blur(0px)",
              ease: "none",
            },
            0.18
          )
          .to(
            finalLeftWord,
            {
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
              ease: "none",
            },
            0.24
          )
          .to(
            finalRightWord,
            {
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
              ease: "none",
            },
            0.24
          );

        ScrollTrigger.refresh();
      };

      build();
      window.addEventListener("resize", build);

      return () => {
        window.removeEventListener("resize", build);
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={pageRef} className="bg-neutral-100 text-black">
      <Header />

      {/* 항상 떠 있는 O를 렌더링한다 */}
      <div className="pointer-events-none fixed inset-0 z-30">
        <div ref={floatingORef} className="fixed left-0 top-0 text-black">
          <OMark className="h-full w-full" />
        </div>
      </div>

      {/* O 옆 기본 단어를 렌더링한다 */}
      <div
        ref={floatingWordRef}
        className="pointer-events-none fixed left-0 top-0 z-20 text-[14vw] font-semibold leading-none tracking-[-0.08em] text-black/90 md:text-[8vw]"
      >
        -LAT
      </div>

      {/* 마지막 섹션에서 O 왼쪽에 붙는 텍스트를 렌더링한다 */}
      <div
        ref={finalLeftWordRef}
        className="pointer-events-none fixed left-0 top-0 z-20 text-[12vw] font-semibold leading-none tracking-[-0.06em] text-black/90 md:text-[6.6vw]"
      >
        eunsu
      </div>

      {/* 마지막 섹션에서 O 오른쪽에 붙는 텍스트를 렌더링한다 */}
      <div
        ref={finalRightWordRef}
        className="pointer-events-none fixed left-0 top-0 z-20 text-[12vw] font-semibold leading-none tracking-[-0.06em] text-black/90 md:text-[6.6vw]"
      >
        @naver.com
      </div>

      {/* SECTION 1 */}
      {/* 세션 1 텍스트 편집 TOP */}
      <section
        ref={introRef}
        className="relative flex min-h-[100svh] items-center bg-transparent px-6 md:px-10"
      >
        <div className="mx-auto grid w-full max-w-7xl grid-cols-12 items-center gap-6">
          <div className="col-span-12 md:col-start-8 md:col-span-5">
            <div className="relative">
              <p className="mb-3 text-xs uppercase tracking-[0.22em] text-black/45 md:text-sm">
                Section 01 · Origin
              </p>

              <h2 className="max-w-3xl text-[9vw] leading-[0.96] tracking-[-0.05em] md:text-[4.2vw]">
                Origin begins with a quiet mark on the left.
              </h2>

              <h3 className="mt-4 max-w-2xl text-lg font-medium tracking-[-0.02em] text-black/82 md:text-2xl">
                A small offset, a strong starting point, a clear rhythm.
              </h3>

              <p className="mt-5 max-w-xl text-sm leading-[1.9] text-black/72 md:text-lg">
                인트로에서는 O와 -LAT가 하나의 로고처럼 보입니다. 여기서부터 디자이너
                김은수의 화면 감각과 구조 감각이 시작됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* 세션 1 텍스트 편집 END */}

      {/* 1 -> 2 전환 구간을 만든다 */}
      <section
        ref={transition12Ref}
        className="relative min-h-[70svh] bg-transparent"
      />

      {/* SECTION 2 */}
      {/* 세션 2 텍스트 편집 TOP */}
      <section
        ref={section2Ref}
        className="relative min-h-[210svh] bg-transparent"
      >
        <div className="sticky top-0 flex h-[100svh] items-center px-6 md:px-10">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-12 items-center gap-6">
            <div className="col-span-12 md:col-start-8 md:col-span-5">
              <div ref={section2ContentRef}>
                <p className="mb-3 text-xs uppercase tracking-[0.22em] text-black/45 md:text-sm">
                  Section 02 · Observe
                </p>
                <h2 className="max-w-3xl text-[9vw] leading-[0.96] tracking-[-0.05em] md:text-[4.2vw]">
                  Observe the order, the spacing, and the visual rhythm.
                </h2>
                <h3 className="mt-4 max-w-2xl text-lg font-medium tracking-[-0.02em] text-black/82 md:text-2xl">
                  See the balance before building the structure.
                </h3>
                <p className="mt-5 max-w-xl text-sm leading-[1.9] text-black/72 md:text-lg">
                  디자이너로서의 은수는 먼저 보는 사람입니다. 구조를 보고, 여백을 보고,
                  시선이 흐르는 순서를 관찰합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 세션 2 텍스트 편집 END */}

      {/* 2 -> 3 전환 구간을 만든다 */}
      <section
        ref={transition23Ref}
        className="relative min-h-[70svh] bg-transparent"
      />

      {/* SECTION 3 */}
      {/* 세션 3 텍스트 편집 TOP */}
      <section
        ref={section3Ref}
        className="relative min-h-[210svh] bg-transparent"
      >
        <div className="sticky top-0 flex h-[100svh] items-center px-6 md:px-10">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-12 items-center gap-6">
            <div className="col-span-12 md:col-span-5">
              <div ref={section3ContentRef}>
                <p className="mb-3 text-xs uppercase tracking-[0.22em] text-black/45 md:text-sm">
                  Section 03 · Organize
                </p>
                <h2 className="max-w-3xl text-[9vw] leading-[0.96] tracking-[-0.05em] md:text-[4.2vw]">
                  Organize the screen so people move through it naturally.
                </h2>
                <h3 className="mt-4 max-w-2xl text-lg font-medium tracking-[-0.02em] text-black/82 md:text-2xl">
                  Arrange the flow, not just the elements.
                </h3>
                <p className="mt-5 max-w-xl text-sm leading-[1.9] text-black/72 md:text-lg">
                  은수의 작업은 결국 정리하는 일에 가깝습니다. 텍스트와 이미지, 인터랙션이
                  하나의 질서 안에서 움직이도록 만드는 것입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 세션 3 텍스트 편집 END */}

      {/* 3 -> 4 전환 구간을 만든다 */}
      <section
        ref={transition34Ref}
        className="relative min-h-[70svh] bg-transparent"
      />

      {/* SECTION 4 */}
      {/* 세션 4 텍스트 편집 TOP */}
      <section
        ref={section4Ref}
        className="relative min-h-[210svh] bg-transparent"
      >
        <div className="sticky top-0 flex h-[100svh] items-center px-6 md:px-10">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-12 items-center gap-6">
            <div className="col-span-12 md:col-start-8 md:col-span-5">
              <div ref={section4ContentRef}>
                <p className="mb-3 text-xs uppercase tracking-[0.22em] text-black/45 md:text-sm">
                  Section 04 · Open
                </p>
                <h2 className="max-w-3xl text-[9vw] leading-[0.96] tracking-[-0.05em] md:text-[4.2vw]">
                  Open to collaboration, ideas, and meaningful work.
                </h2>
                <h3 className="mt-4 max-w-2xl text-lg font-medium tracking-[-0.02em] text-black/82 md:text-2xl">
                  Stay open, keep refining, keep building.
                </h3>
                <p className="mt-5 max-w-xl text-sm leading-[1.9] text-black/72 md:text-lg">
                  좋은 작업은 혼자 닫혀 있기보다, 함께 확장될 때 더 깊어집니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 세션 4 텍스트 편집 END */}

      {/* 4 -> 5 전환 구간을 만든다 */}
      <section
        ref={transition45Ref}
        className="relative min-h-[70svh] bg-transparent"
      />

      {/* SECTION 5 */}
      {/* 세션 5 텍스트 편집 TOP */}
      <section
        ref={section5Ref}
        className="relative min-h-[150svh] bg-transparent"
      >
        <div className="sticky top-0 flex h-[100svh] items-center justify-center px-6 md:px-10">
          <div ref={section5ContentRef} className="text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-black/45 md:text-sm">
              Section 05 · Contact
            </p>
            <h2 className="text-[10vw] leading-[0.95] tracking-[-0.06em] md:text-[4.6vw]">
              eunsuo@naver.com
            </h2>
            <p className="mt-5 text-sm leading-[1.9] text-black/72 md:text-lg">
              Original thoughts, open structure, ongoing design work.
            </p>
          </div>
        </div>
      </section>
      {/* 세션 5 텍스트 편집 END */}
    </main>
  );
}