"use client";

import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import Header from "@/components/Header";

const works = [
  {
    title: "Editorial Poster Series",
    description:
      "강한 타이포와 절제된 무채색 구성을 바탕으로 전시 포스터의 인상을 재구성한 작업입니다.",
    tools: ["Photoshop", "Illustrator", "Figma"],
    techniques: ["Typography", "Grid System", "Contrast Control"],
    imagery: ["Poster Mockup", "Type Detail", "Texture Crop"],
    cover: "/images/design-01.jpg",
    thumbs: [
      "/images/design-01.jpg",
      "/images/design-02.jpg",
      "/images/design-03.jpg",
    ],
  },
  {
    title: "Brand Identity Layout",
    description:
      "브랜드의 정체성을 시각적 리듬으로 정리하고, 인쇄물과 디지털 화면에 동시에 적용 가능한 체계를 설계했습니다.",
    tools: ["Illustrator", "InDesign", "Figma"],
    techniques: ["Identity System", "Editorial Layout", "Minimal Composition"],
    imagery: ["Logo Sheet", "Stationery", "Key Visual"],
    cover: "/images/design-02.jpg",
    thumbs: [
      "/images/design-02.jpg",
      "/images/design-03.jpg",
      "/images/design-04.jpg",
    ],
  },
  {
    title: "Interface Mood Study",
    description:
      "웹 인터페이스 안에서 컬러, 여백, 타이포, 이미지 비율이 주는 감정선을 실험한 디자인 스터디입니다.",
    tools: ["Figma", "Photoshop"],
    techniques: ["UI Composition", "Visual Hierarchy", "Rhythm Study"],
    imagery: ["UI Frame", "Mood Crop", "Detail Shot"],
    cover: "/images/design-03.jpg",
    thumbs: [
      "/images/design-03.jpg",
      "/images/design-04.jpg",
      "/images/design-01.jpg",
    ],
  },
];

export default function DesignPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const descRef = useRef<HTMLDivElement | null>(null);
  const coverRef = useRef<HTMLButtonElement | null>(null);

  const currentWork = useMemo(() => works[currentIndex], [currentIndex]);

  const animateTo = (nextIndex: number) => {
    if (
      nextIndex < 0 ||
      nextIndex >= works.length ||
      nextIndex === currentIndex ||
      !titleRef.current ||
      !descRef.current ||
      !coverRef.current
    ) {
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(nextIndex);

        requestAnimationFrame(() => {
          gsap.fromTo(
            [titleRef.current, coverRef.current, descRef.current],
            {
              opacity: 0,
              x: 64,
            },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.05,
            }
          );
        });
      },
    });

    tl.to([titleRef.current, coverRef.current, descRef.current], {
      opacity: 0,
      x: -56,
      duration: 0.34,
      ease: "power2.inOut",
      stagger: 0.04,
    });
  };

  return (
    <main className="h-[100dvh] overflow-hidden bg-neutral-100 text-black">
      <Header />

      <section className="h-[100dvh] px-4 pt-24 pb-6 sm:px-6 md:px-8 lg:px-10 lg:pt-28">
        <div className="mx-auto flex h-full max-w-7xl flex-col">
          <div className="mb-4 flex items-center justify-between lg:mb-5">
            <p className="text-[11px] uppercase tracking-[0.22em] opacity-60 sm:text-xs">
              Design Works
            </p>

            <p className="text-[11px] uppercase tracking-[0.18em] opacity-50 sm:text-xs">
              {String(currentIndex + 1).padStart(2, "0")} /{" "}
              {String(works.length).padStart(2, "0")}
            </p>
          </div>

          <div className="hidden flex-1 overflow-hidden xl:grid xl:grid-cols-12 xl:gap-8">
            <div className="col-span-8 flex h-full flex-col overflow-hidden">
              <div className="shrink-0 pb-4">
                <h1
                  ref={titleRef}
                  className="max-w-5xl text-[clamp(2rem,4.6vw,5rem)] leading-[0.92] tracking-[-0.04em]"
                >
                  {currentWork.title}
                </h1>
              </div>

              <div className="min-h-0 flex-1">
                <button
                  ref={coverRef}
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="flex h-full w-full items-center justify-center overflow-hidden rounded-[28px] border border-black/10 bg-white px-5 py-5 shadow-sm transition hover:shadow-md"
                >
                  <img
                    src={currentWork.cover}
                    alt={currentWork.title}
                    className="h-full w-auto max-w-full object-contain"
                  />
                </button>
              </div>
            </div>

            <div
              ref={descRef}
              className="col-span-4 flex h-full flex-col justify-between overflow-hidden"
            >
              <div className="overflow-hidden">
                <p className="text-[clamp(0.82rem,0.9vw,1rem)] leading-[1.85] opacity-80">
                  {currentWork.description}
                </p>

                <div className="mt-6 grid gap-5">
                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-[0.18em] opacity-50">
                      Tools
                    </p>
                    <ul className="space-y-1 text-[13px] leading-[1.6]">
                      {currentWork.tools.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-[0.18em] opacity-50">
                      Techniques
                    </p>
                    <ul className="space-y-1 text-[13px] leading-[1.6]">
                      {currentWork.techniques.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-[0.18em] opacity-50">
                      Imagery
                    </p>
                    <ul className="space-y-1 text-[13px] leading-[1.6]">
                      {currentWork.imagery.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 shrink-0">
                <p className="mb-2 text-[10px] uppercase tracking-[0.18em] opacity-50">
                  Preview
                </p>
                <div className="flex gap-3">
                  {currentWork.thumbs.map((thumb, index) => (
                    <div
                      key={`${thumb}-${index}`}
                      className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-white"
                    >
                      <img
                        src={thumb}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col xl:hidden">
            <div className="mb-4 shrink-0">
              <h1
                ref={titleRef}
                className="max-w-4xl text-[clamp(1.75rem,7vw,3rem)] leading-[0.95] tracking-[-0.04em]"
              >
                {currentWork.title}
              </h1>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center">
              <button
                ref={coverRef}
                type="button"
                onClick={() => setModalOpen(true)}
                className="flex h-full w-full items-center justify-center overflow-hidden rounded-[24px] border border-black/10 bg-white px-3 py-3 shadow-sm"
              >
                <div className="flex h-full max-h-[58svh] w-full items-center justify-center">
                  <img
                    src={currentWork.cover}
                    alt={currentWork.title}
                    className="h-full w-auto max-w-full object-contain"
                  />
                </div>
              </button>
            </div>

            <div className="mt-4 shrink-0">
              <p className="text-[11px] uppercase tracking-[0.18em] opacity-50">
                Tap the image to view details
              </p>
            </div>
          </div>

          <div className="mt-4 flex shrink-0 items-center justify-between">
            <button
              type="button"
              onClick={() => animateTo(currentIndex - 1)}
              className="rounded-full border border-black/10 px-3 py-2 text-[11px] uppercase tracking-[0.18em] transition hover:bg-black hover:text-white sm:px-4 sm:text-xs"
            >
              Prev
            </button>

            <button
              type="button"
              onClick={() => animateTo(currentIndex + 1)}
              className="rounded-full border border-black/10 px-3 py-2 text-[11px] uppercase tracking-[0.18em] transition hover:bg-black hover:text-white sm:px-4 sm:text-xs"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-[70] bg-black/70 px-4 py-6 backdrop-blur-sm md:px-8">
          <div className="mx-auto flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-[28px] bg-white text-black shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 md:px-6">
              <p className="text-xs uppercase tracking-[0.18em] opacity-60">
                Work Detail
              </p>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-xs uppercase tracking-[0.18em]"
              >
                Close
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5 md:px-6 md:py-6">
              <h2 className="text-2xl tracking-[-0.03em] md:text-4xl">
                {currentWork.title}
              </h2>

              <p className="mt-4 text-sm leading-[1.9] opacity-80 md:text-base">
                {currentWork.description}
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.18em] opacity-50">
                    Tools
                  </p>
                  <ul className="space-y-1 text-sm">
                    {currentWork.tools.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.18em] opacity-50">
                    Techniques
                  </p>
                  <ul className="space-y-1 text-sm">
                    {currentWork.techniques.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.18em] opacity-50">
                    Imagery
                  </p>
                  <ul className="space-y-1 text-sm">
                    {currentWork.imagery.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <p className="mb-3 text-xs uppercase tracking-[0.18em] opacity-50">
                  Preview
                </p>
                <div className="flex gap-3">
                  {currentWork.thumbs.map((thumb, index) => (
                    <div
                      key={`${thumb}-${index}`}
                      className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-neutral-100"
                    >
                      <img
                        src={thumb}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}