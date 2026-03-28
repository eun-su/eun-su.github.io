"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import Header from "@/components/Header";

type ProjectDetailBlock = {
  label: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type ProjectWork = {
  id: string;
  step: string;
  category: string;
  title: string;
  description: string;
  tools: string[];
  techniques: string[];
  imagery: string[];
  cover: string;
  detailBlocks: ProjectDetailBlock[];
};

const works: ProjectWork[] = [
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
    cover: "/images/card/project01img01.jpg",
    detailBlocks: [
      {
        label: "Overview",
        title: "프로젝트 개요",
        paragraphs: [
          "기존 사이트는 정보 우선순위와 화면 리듬이 일정하지 않아 사용자가 핵심 내용을 파악하는 데 시간이 걸렸습니다.",
          "그래서 전체적인 레이아웃 흐름, 타이포 밀도, 시선 이동 구간을 먼저 재정리하고 브랜드 인상이 더 명확하게 보이도록 방향을 잡았습니다.",
        ],
      },
      {
        label: "Process",
        title: "정리한 작업 범위",
        paragraphs: [
          "메인 화면의 인상과 정보 배치, 주요 섹션 간 리듬, 운영 시 자주 수정되는 구간의 구조를 함께 점검했습니다.",
        ],
        bullets: [
          "메인 시각 구조 재정리",
          "콘텐츠 우선순위 정렬",
          "반응형 화면 밀도 조정",
          "운영 편의성 고려",
        ],
      },
      {
        label: "Result",
        title: "결과와 방향",
        paragraphs: [
          "단순히 예쁘게 보이게 하는 것이 아니라 실제 서비스 흐름 안에서 정보 전달과 사용성, 운영 관점을 함께 맞추는 데 초점을 두었습니다.",
        ],
      },
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
    cover: "/images/card/project02img01.jpg",
    detailBlocks: [
      {
        label: "Overview",
        title: "프로젝트 개요",
        paragraphs: [
          "문의에서 끝나는 것이 아니라 실제 결제와 확인 단계까지 이어지는 흐름이 자연스럽게 연결되도록 설계하는 작업이 필요했습니다.",
          "사용자 입장에서는 입력과 결제가 부드럽게 이어져야 했고, 운영자 입장에서는 확인과 처리 흐름이 명확해야 했습니다.",
        ],
      },
      {
        label: "Flow",
        title: "핵심 플로우",
        paragraphs: [
          "입력 → 검토 → 결제 → 후속 처리로 이어지는 흐름을 한 덩어리로 보고, 끊기는 지점을 줄이는 방향으로 구성했습니다.",
        ],
        bullets: [
          "게시판 입력 구조 조정",
          "운영자 확인 구간 정리",
          "결제 단계 연결",
          "후속 응대 흐름 정비",
        ],
      },
      {
        label: "Result",
        title: "의미 있는 포인트",
        paragraphs: [
          "단순 기능 연결이 아니라 사용성과 운영 프로세스를 함께 본 점이 중요했습니다. 실제 서비스 화면과 관리 흐름을 동시에 다루는 경험이었습니다.",
        ],
      },
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
    cover: "/images/card/project03img01.jpg",
    detailBlocks: [
      {
        label: "Overview",
        title: "프로젝트 개요",
        paragraphs: [
          "사용자와 고객이 실제로 머무는 구간을 기준으로 화면을 다시 살펴보며, 이탈이 많거나 이해가 어려운 부분을 우선적으로 정리했습니다.",
        ],
      },
      {
        label: "UX Review",
        title: "집중한 포인트",
        paragraphs: [
          "상세 페이지, 문의 진입, 구매 전환 직전 등 실제 행동이 일어나는 접점에서 시선 흐름과 정보 배치를 조정했습니다.",
        ],
        bullets: [
          "상세 정보 배치 조정",
          "문의 진입 구조 개선",
          "전환 직전 흐름 정리",
          "고객 시점 정보 보강",
        ],
      },
      {
        label: "Result",
        title: "정리한 방향",
        paragraphs: [
          "사용자가 판단해야 하는 순간에 필요한 정보가 더 명확하게 보이도록 하는 데 집중했고, 화면이 단순해 보이더라도 실제 행동 흐름이 자연스럽게 이어지도록 설계했습니다.",
        ],
      },
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
    cover: "/images/card/project04img01.jpg",
    detailBlocks: [
      {
        label: "Overview",
        title: "프로젝트 개요",
        paragraphs: [
          "광고는 노출만으로 끝나지 않기 때문에 실제 유입 이후의 흐름과 사이트 안에서의 반응까지 함께 살피는 방식으로 작업했습니다.",
        ],
      },
      {
        label: "Operation",
        title: "협업 방식",
        paragraphs: [
          "검색광고, 기획전 운영, 제휴 협업 등 개별 작업을 따로 보지 않고 실제 반응과 운영 연결까지 한 흐름으로 이해하려고 했습니다.",
        ],
        bullets: [
          "유입 채널 점검",
          "캠페인/기획전 연결",
          "성과 흐름 분석",
          "운영 협업 정리",
        ],
      },
      {
        label: "Result",
        title: "의미 있는 포인트",
        paragraphs: [
          "디자인, 개발, 운영, 마케팅을 각각 따로 떼지 않고 전환 관점에서 연결해 본 경험이라는 점이 가장 중요했습니다.",
        ],
      },
    ],
  },
];

const MOBILE_PRIMARY_COUNT = 2;

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
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const desktopTitleRef = useRef<HTMLHeadingElement | null>(null);
  const desktopScrollRef = useRef<HTMLDivElement | null>(null);
  const desktopSideRef = useRef<HTMLDivElement | null>(null);

  const mobileTitleRef = useRef<HTMLHeadingElement | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement | null>(null);
  const mobileInfoRef = useRef<HTMLDivElement | null>(null);

  const currentWork = useMemo(() => works[currentIndex], [currentIndex]);

  const mobilePrimaryWorks = works.slice(0, MOBILE_PRIMARY_COUNT);
  const mobileHiddenWorks = works.slice(MOBILE_PRIMARY_COUNT);
  const hiddenIds = new Set(mobileHiddenWorks.map((work) => work.id));
  const isHiddenWorkActive = hiddenIds.has(currentWork.id);

  const syncHash = (nextIndex: number) => {
    if (typeof window === "undefined") {
      return;
    }

    const nextHash = `#${works[nextIndex].id}`;
    if (window.location.hash === nextHash) {
      return;
    }

    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${nextHash}`
    );
  };

  const getActiveScrollContainer = () => {
    return isDesktop ? desktopScrollRef.current : mobileScrollRef.current;
  };

  const getActiveAnimationTargets = () => {
    if (isDesktop) {
      return [
        desktopTitleRef.current,
        desktopScrollRef.current,
        desktopSideRef.current,
      ].filter(Boolean) as HTMLElement[];
    }

    return [
      mobileTitleRef.current,
      mobileScrollRef.current,
      mobileInfoRef.current,
    ].filter(Boolean) as HTMLElement[];
  };

  const scrollContentToTop = (behavior: ScrollBehavior = "smooth") => {
    const container = getActiveScrollContainer();

    if (!container) {
      return;
    }

    container.scrollTo({
      top: 0,
      behavior,
    });
  };

  const scrollContentToEnd = (behavior: ScrollBehavior = "smooth") => {
    const container = getActiveScrollContainer();

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  };

  const applyIndexImmediately = (nextIndex: number) => {
    const safeIndex = Math.max(0, Math.min(works.length - 1, nextIndex));

    setCurrentIndex(safeIndex);
    setMobileMoreOpen(false);
    syncHash(safeIndex);

    requestAnimationFrame(() => {
      scrollContentToTop("auto");
    });
  };

  const animateTo = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= works.length || nextIndex === currentIndex) {
      return;
    }

    const targets = getActiveAnimationTargets();

    if (targets.length === 0) {
      applyIndexImmediately(nextIndex);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(nextIndex);
        setMobileMoreOpen(false);
        syncHash(nextIndex);

        requestAnimationFrame(() => {
          scrollContentToTop("auto");

          const nextTargets = getActiveAnimationTargets();

          if (nextTargets.length > 0) {
            gsap.fromTo(
              nextTargets,
              {
                opacity: 0,
                x: 48,
              },
              {
                opacity: 1,
                x: 0,
                duration: 0.48,
                ease: "power3.out",
                stagger: 0.05,
              }
            );
          }
        });
      },
    });

    tl.to(targets, {
      opacity: 0,
      x: -40,
      duration: 0.28,
      ease: "power2.inOut",
      stagger: 0.04,
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(min-width: 1280px)");

    const updateViewportMode = () => {
      setIsDesktop(mediaQuery.matches);
    };

    updateViewportMode();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateViewportMode);
      return () => {
        mediaQuery.removeEventListener("change", updateViewportMode);
      };
    }

    mediaQuery.addListener(updateViewportMode);
    return () => {
      mediaQuery.removeListener(updateViewportMode);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const initialIndex = getIndexByHash(window.location.hash);
    setCurrentIndex(initialIndex);
    syncHash(initialIndex);

    requestAnimationFrame(() => {
      scrollContentToTop("auto");
    });

    const handleHashChange = () => {
      const nextIndex = getIndexByHash(window.location.hash);
      setCurrentIndex(nextIndex);
      setMobileMoreOpen(false);

      requestAnimationFrame(() => {
        scrollContentToTop("auto");
      });
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [isDesktop]);

  return (
    <main className="h-[100dvh] overflow-hidden bg-neutral-100 text-black">
      <Header />

      <section className="h-[100dvh] px-4 pt-24 pb-6 sm:px-6 md:px-8 lg:px-10 lg:pt-28">
        <div className="flex h-full w-full min-w-0 flex-col">
          <div className="mb-4 flex items-center justify-between lg:mb-5">
            <p className="text-[11px] uppercase tracking-[0.22em] opacity-60 sm:text-xs">
              Projects
            </p>

            <p className="text-[11px] uppercase tracking-[0.18em] opacity-50 sm:text-xs">
              {currentWork.step} · {String(currentIndex + 1).padStart(2, "0")} /{" "}
              {String(works.length).padStart(2, "0")}
            </p>
          </div>

          <div className="relative mb-4 xl:hidden">
            <div className="flex flex-wrap items-center gap-2 overflow-hidden">
              {mobilePrimaryWorks.map((work, index) => {
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

              {mobileHiddenWorks.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMobileMoreOpen((prev) => !prev)}
                  className={`shrink-0 rounded-full border px-3 py-2 text-[11px] uppercase tracking-[0.16em] transition sm:text-xs ${
                    isHiddenWorkActive || mobileMoreOpen
                      ? "border-black bg-black text-white"
                      : "border-black/10 bg-white text-black hover:bg-black hover:text-white"
                  }`}
                >
                  More
                </button>
              )}
            </div>

            {mobileMoreOpen && mobileHiddenWorks.length > 0 && (
              <div className="absolute right-0 top-[calc(100%+0.5rem)] z-20 min-w-[15rem] rounded-[22px] border border-black/10 bg-white/95 p-3 shadow-lg backdrop-blur-sm">
                <div className="grid gap-2">
                  {mobileHiddenWorks.map((work, hiddenIndex) => {
                    const actualIndex = hiddenIndex + MOBILE_PRIMARY_COUNT;
                    const isActive = actualIndex === currentIndex;

                    return (
                      <button
                        key={work.id}
                        type="button"
                        onClick={() => applyIndexImmediately(actualIndex)}
                        className={`w-full rounded-[16px] border px-3 py-3 text-left transition ${
                          isActive
                            ? "border-black bg-black text-white"
                            : "border-black/10 bg-white text-black hover:border-black hover:bg-black hover:text-white"
                        }`}
                      >
                        <p className="text-[10px] uppercase tracking-[0.18em] opacity-60">
                          {work.step}
                        </p>
                        <p className="mt-1 text-sm leading-[1.45]">{work.category}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
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

            <div
              ref={desktopScrollRef}
              className="min-h-0 overflow-y-auto pr-2 [scrollbar-gutter:stable] [scrollbar-width:thin]"
            >
              <div className="flex min-h-full flex-col">
                <div className="shrink-0 pb-4">
                  <p className="mb-3 text-[11px] uppercase tracking-[0.18em] opacity-45">
                    {currentWork.category}
                  </p>
                  <h1
                    ref={desktopTitleRef}
                    className="max-w-4xl text-[clamp(1.05rem,2.15vw,2.45rem)] leading-[1.04] tracking-[-0.035em]"
                  >
                    {currentWork.title}
                  </h1>
                </div>

                <div className="overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="flex h-full w-full items-center justify-center overflow-hidden bg-white px-5 py-5 transition hover:shadow-md"
                  >
                    <img
                      src={currentWork.cover}
                      alt={currentWork.title}
                      className="h-auto w-full object-cover"
                    />
                  </button>
                </div>

                <div className="mt-5 grid gap-4 pb-8">
                  {currentWork.detailBlocks.map((block) => (
                    <section
                      key={`${currentWork.id}-${block.label}`}
                      className="rounded-[24px] border border-black/10 bg-white/85 p-5 shadow-sm"
                    >
                      <p className="mb-2 text-[10px] uppercase tracking-[0.18em] opacity-45">
                        {block.label}
                      </p>
                      <h2 className="text-[clamp(1rem,1.4vw,1.45rem)] leading-[1.18] tracking-[-0.02em]">
                        {block.title}
                      </h2>

                      <div className="mt-3 space-y-3">
                        {block.paragraphs.map((paragraph) => (
                          <p
                            key={paragraph}
                            className="text-[clamp(0.92rem,0.98vw,1rem)] leading-[1.82] opacity-80"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      {block.bullets && block.bullets.length > 0 && (
                        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                          {block.bullets.map((bullet) => (
                            <li
                              key={bullet}
                              className="rounded-[16px] border border-black/10 bg-neutral-50 px-4 py-3 text-sm leading-[1.6] opacity-80"
                            >
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>
                  ))}
                </div>
              </div>
            </div>

            <div
              ref={desktopSideRef}
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
                <p className="mb-3 text-[10px] uppercase tracking-[0.18em] opacity-50">
                  Preview
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => scrollContentToTop()}
                    className="rounded-full border border-black/10 bg-white px-4 py-3 text-[11px] uppercase tracking-[0.18em] transition hover:bg-black hover:text-white"
                  >
                    Top
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollContentToEnd()}
                    className="rounded-full border border-black/10 bg-white px-4 py-3 text-[11px] uppercase tracking-[0.18em] transition hover:bg-black hover:text-white"
                  >
                    End
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col xl:hidden">
            <div className="mb-4 shrink-0">
              <p className="mb-3 text-[11px] uppercase tracking-[0.18em] opacity-45">
                {currentWork.category}
              </p>
              <h1
                ref={mobileTitleRef}
                className="max-w-4xl text-[clamp(1.2rem,4vw,1.8rem)] leading-[1.06] tracking-[-0.035em]"
              >
                {currentWork.title}
              </h1>
            </div>

            <div
              ref={mobileScrollRef}
              className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:thin]"
            >
              <div className="flex min-h-full flex-col pb-6">
                <div className="overflow-hidden rounded-[24px] border border-black/10 bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="flex h-full w-full items-center justify-center overflow-hidden bg-white px-3 py-3"
                  >
                    <img
                      src={currentWork.cover}
                      alt={currentWork.title}
                      className="h-auto w-full object-cover"
                    />
                  </button>
                </div>

                <div className="mt-4 grid gap-4">
                  {currentWork.detailBlocks.map((block) => (
                    <section
                      key={`${currentWork.id}-mobile-${block.label}`}
                      className="rounded-[22px] border border-black/10 bg-white/85 p-4 shadow-sm"
                    >
                      <p className="mb-2 text-[10px] uppercase tracking-[0.18em] opacity-45">
                        {block.label}
                      </p>
                      <h2 className="text-[1rem] leading-[1.2] tracking-[-0.02em]">
                        {block.title}
                      </h2>

                      <div className="mt-3 space-y-3">
                        {block.paragraphs.map((paragraph) => (
                          <p key={paragraph} className="text-sm leading-[1.82] opacity-80">
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      {block.bullets && block.bullets.length > 0 && (
                        <ul className="mt-4 grid gap-2">
                          {block.bullets.map((bullet) => (
                            <li
                              key={bullet}
                              className="rounded-[14px] border border-black/10 bg-neutral-50 px-3 py-3 text-sm leading-[1.6] opacity-80"
                            >
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>
                  ))}
                </div>
              </div>
            </div>

            <div
              ref={mobileInfoRef}
              className="mt-4 shrink-0 rounded-[24px] border border-black/10 bg-white/80 p-4 shadow-sm"
            >
              <p className="text-sm leading-[1.85] opacity-80">{currentWork.description}</p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => scrollContentToTop()}
                  className="rounded-full border border-black/10 bg-white px-4 py-3 text-[11px] uppercase tracking-[0.18em] transition hover:bg-black hover:text-white"
                >
                  Top
                </button>

                <button
                  type="button"
                  onClick={() => scrollContentToEnd()}
                  className="rounded-full border border-black/10 bg-white px-4 py-3 text-[11px] uppercase tracking-[0.18em] transition hover:bg-black hover:text-white"
                >
                  End
                </button>
              </div>
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

              <div className="mt-8 grid gap-4">
                {currentWork.detailBlocks.map((block) => (
                  <section
                    key={`${currentWork.id}-modal-${block.label}`}
                    className="rounded-[22px] border border-black/10 bg-neutral-50 p-4"
                  >
                    <p className="mb-2 text-xs uppercase tracking-[0.18em] opacity-50">
                      {block.label}
                    </p>
                    <h3 className="text-lg tracking-[-0.02em]">{block.title}</h3>

                    <div className="mt-3 space-y-3">
                      {block.paragraphs.map((paragraph) => (
                        <p key={paragraph} className="text-sm leading-[1.9] opacity-80">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {block.bullets && block.bullets.length > 0 && (
                      <ul className="mt-4 grid gap-2 md:grid-cols-2">
                        {block.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="rounded-[14px] border border-black/10 bg-white px-3 py-3 text-sm leading-[1.6]"
                          >
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}