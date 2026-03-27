"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import Header from "@/components/Header";

type DesignWork = {
  id: string;
  step: string;
  category: string;
  title: string;
  description: string;
  tools: string[];
  techniques: string[];
  imagery: string[];
  cover: string;
  thumbs: string[];
};

const works: DesignWork[] = [
  {
    id: "project-renewal",
    step: "3-1",
    category: "홈페이지 리뉴얼 및 튜닝",
    title: "브랜드 인상과 사용성을 함께 정리하는 리뉴얼 작업을 진행했습니다.",
    description:
      "기존 사이트의 구조와 화면 밀도를 점검하고, 사용자가 더 빠르게 핵심 정보에 도달할 수 있도록 레이아웃과 인터랙션을 재정리한 작업입니다.",
    tools: ["Figma", "HTML", "SCSS", "React"],
    techniques: ["UI 구조 재정리", "화면 밀도 조정", "운영 흐름 튜닝"],
    imagery: ["Main Visual", "Section Layout", "Responsive Detail"],
    cover: "/images/design-01.jpg",
    thumbs: [
      "/images/design-01.jpg",
      "/images/design-02.jpg",
      "/images/design-03.jpg",
    ],
  },
  {
    id: "project-payment",
    step: "3-2",
    category: "문의 및 결제 시스템 구축",
    title: "문의와 결제, 확인 단계가 자연스럽게 이어지도록 흐름을 설계했습니다.",
    description:
      "사용자 입력, 관리자 확인, 결제 연결, 후속 응대까지 하나의 흐름으로 보며 끊기지 않는 경험을 만들기 위해 게시판과 결제 관련 화면을 함께 다뤘습니다.",
    tools: ["JSP", "JavaScript", "게시판 연동", "PG 연동"],
    techniques: ["문의 플로우 설계", "결제 단계 연결", "운영 확인 프로세스"],
    imagery: ["Inquiry Form", "Payment Flow", "Admin Checkpoint"],
    cover: "/images/design-02.jpg",
    thumbs: [
      "/images/design-02.jpg",
      "/images/design-03.jpg",
      "/images/design-04.jpg",
    ],
  },
  {
    id: "project-ux",
    step: "3-3",
    category: "사용자 · 고객 접점 개선",
    title: "사용자와 고객이 실제로 머무는 구간을 중심으로 화면을 개선했습니다.",
    description:
      "홈페이지와 쇼핑몰에서 이탈이 생기기 쉬운 구간을 중심으로 정보 구조와 시선 흐름을 정리하고, 문의와 구매 전환 구간을 더 명확하게 다듬었습니다.",
    tools: ["Cafe24", "고도몰", "아임웹", "Figma"],
    techniques: ["사용자 여정 점검", "상세/문의 흐름 개선", "전환 구간 정리"],
    imagery: ["Customer Journey", "Detail Page", "Conversion Point"],
    cover: "/images/design-03.jpg",
    thumbs: [
      "/images/design-03.jpg",
      "/images/design-04.jpg",
      "/images/design-01.jpg",
    ],
  },
  {
    id: "project-marketing",
    step: "3-4",
    category: "광고 운영 및 마케팅 협업",
    title: "광고 이후의 유입과 전환까지 이어지는 흐름을 함께 보며 운영했습니다.",
    description:
      "검색광고, 기획전, 제휴 협업, 운영 데이터를 연결해서 단순 노출이 아니라 실제 반응과 전환으로 이어지는 접점을 찾고 조정한 경험을 담았습니다.",
    tools: ["네이버 검색광고", "GA4", "기획전 운영", "제휴 협업"],
    techniques: ["유입 분석", "성과 흐름 점검", "운영/마케팅 협업"],
    imagery: ["Campaign Overview", "Traffic Data", "Promotion Assets"],
    cover: "/images/design-04.jpg",
    thumbs: [
      "/images/design-04.jpg",
      "/images/design-02.jpg",
      "/images/design-01.jpg",
    ],
  },
];

const getIndexByHash = (hashValue: string) => {
  const cleanHash = hashValue.replace("#", "").trim();
  const foundIndex = works.findIndex((work) => work.id === cleanHash);
  return foundIndex >= 0 ? foundIndex : 0;
};

export default function ProjectsPage() {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (typeof window === "undefined") {
      return 0;
    }

    return getIndexByHash(window.location.hash);
  });
  const [modalOpen, setModalOpen] = useState(false);

  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const descRef = useRef<HTMLDivElement | null>(null);
  const coverRef = useRef<HTMLButtonElement | null>(null);

  const currentWork = useMemo(() => works[currentIndex], [currentIndex]);

  const syncHash = (nextIndex: number) => {
    if (typeof window === "undefined") {
      return;
    }

    const nextHash = `#${works[nextIndex].id}`;
    if (window.location.hash === nextHash) {
      return;
    }

    window.history.replaceState(null, "", `${window.location.pathname}${nextHash}`);
  };

  const applyIndexImmediately = (nextIndex: number) => {
    const safeIndex = Math.max(0, Math.min(works.length - 1, nextIndex));
    setCurrentIndex(safeIndex);
    syncHash(safeIndex);
  };

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
        syncHash(nextIndex);

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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const initialIndex = getIndexByHash(window.location.hash);
    setCurrentIndex(initialIndex);
    syncHash(initialIndex);

    const handleHashChange = () => {
      const nextIndex = getIndexByHash(window.location.hash);
      setCurrentIndex(nextIndex);
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <main className="h-[100dvh] overflow-hidden bg-neutral-100 text-black">
      <Header />

      <section className="h-[100dvh] px-4 pt-24 pb-6 sm:px-6 md:px-8 lg:px-10 lg:pt-28">
        <div className="mx-auto flex h-full max-w-7xl flex-col">
          <div className="mb-4 flex items-center justify-between lg:mb-5">
            <p className="text-[11px] uppercase tracking-[0.22em] opacity-60 sm:text-xs">
              Projects
            </p>

            <p className="text-[11px] uppercase tracking-[0.18em] opacity-50 sm:text-xs">
              {currentWork.step} · {String(currentIndex + 1).padStart(2, "0")} /{" "}
              {String(works.length).padStart(2, "0")}
            </p>
          </div>

          <div className="mb-4 flex gap-2 overflow-x-auto pb-1 xl:hidden">
            {works.map((work, index) => {
              const isActive = index === currentIndex;

              return (
                <button
                  key={work.id}
                  type="button"
                  onClick={() => applyIndexImmediately(index)}
                  className={`shrink-0 rounded-full border px-3 py-2 text-[11px] uppercase tracking-[0.16em] transition sm:text-xs ${
                    isActive
                      ? "border-black bg-black text-white"
                      : "border-black/10 bg-white text-black hover:bg-black hover:text-white"
                  }`}
                >
                  {work.step} · {work.category}
                </button>
              );
            })}
          </div>

          <div className="hidden min-h-0 flex-1 overflow-hidden xl:grid xl:grid-cols-[15rem_minmax(0,1fr)_19rem] xl:gap-8">
            <aside className="flex h-full flex-col justify-between overflow-hidden rounded-[28px] border border-black/10 bg-white/80 p-4 shadow-sm">
              <div>
                <p className="mb-4 text-[10px] uppercase tracking-[0.18em] opacity-45">
                  Category
                </p>

                <div className="grid gap-2">
                  {works.map((work, index) => {
                    const isActive = index === currentIndex;

                    return (
                      <button
                        key={work.id}
                        type="button"
                        onClick={() => applyIndexImmediately(index)}
                        className={`w-full rounded-[20px] border px-3 py-3 text-left transition ${
                          isActive
                            ? "border-black bg-black text-white"
                            : "border-black/10 bg-white text-black hover:border-black hover:bg-black hover:text-white"
                        }`}
                      >
                        <p className="text-[10px] uppercase tracking-[0.18em] opacity-60">
                          {work.step}
                        </p>
                        <p className="mt-1 text-sm leading-[1.5]">{work.category}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="text-[11px] leading-[1.8] opacity-55">
                메인 세션 3의 더보기 버튼과 같은 기준으로 연결되어 원하는 프로젝트 위치로 바로 이동할 수 있습니다.
              </p>
            </aside>

            <div className="flex h-full min-h-0 flex-col overflow-hidden">
              <div className="shrink-0 pb-4">
                <p className="mb-3 text-[11px] uppercase tracking-[0.18em] opacity-45">
                  {currentWork.category}
                </p>
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
              className="flex h-full flex-col justify-between overflow-hidden"
            >
              <div className="overflow-hidden rounded-[28px] border border-black/10 bg-white/80 p-5 shadow-sm">
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

              <div className="mt-6 shrink-0 rounded-[28px] border border-black/10 bg-white/80 p-5 shadow-sm">
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
              <p className="mb-3 text-[11px] uppercase tracking-[0.18em] opacity-45">
                {currentWork.category}
              </p>
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

            <div ref={descRef} className="mt-4 shrink-0 rounded-[24px] border border-black/10 bg-white/80 p-4 shadow-sm">
              <p className="text-sm leading-[1.85] opacity-80">{currentWork.description}</p>
              <p className="mt-4 text-[11px] uppercase tracking-[0.18em] opacity-50">
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
                {currentWork.step} · {currentWork.category}
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
