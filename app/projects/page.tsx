"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import Header from "@/components/Header";
import styles from "./ProjectsPage.module.scss";

type ProjectDetailBlock = {
  label: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type ProjectAction = {
  label: string;
  href: string;
  openInNewTab?: boolean;
  downloadFileName?: string;
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
  action: ProjectAction;
  detailBlocks: ProjectDetailBlock[];
};

const works: ProjectWork[] = [
  {
    id: "project-renewal",
    step: "3-1",
    category: "홈페이지 리뉴얼 및 API 연결",
    title: "브랜드 인상과 사용성을 함께 정리하는 리뉴얼 작업을 진행했습니다.",
    description:
      "기존 사이트의 구조와 화면 밀도를 점검하고, 사용자가 더 빠르게 핵심 정보에 도달할 수 있도록 레이아웃과 인터랙션을 재정리한 작업입니다.",
    tools: ["Figma", "HTML", "SCSS", "React"],
    techniques: ["UI 구조 재정리", "화면 밀도 조정", "운영 흐름 튜닝"],
    imagery: ["Main Visual", "Section Layout", "Responsive Detail"],
    cover: "/images/card/project01img01.jpg",
    action: {
      label: "View",
      href: "https://luxavenue.co.kr",
      openInNewTab: true,
    },
    detailBlocks: [
      {
        label: "Overview",
        title: "프로젝트 개요",
        paragraphs: [
          "기존 사이트는 정보 우선순위와 화면 리듬이 일정하지 않은 방식으로 사용자가 원하는 내용을 한눈에 찾기 어려웠습니다",
          "플로그인과 결제 모듈 사용 불가, 서버 접근에 보안적 이슈 등으로 새로운 프레임워크로 사이트 구축이 필요했습니다",
          "그래서 전체적인 레이아웃 흐름, 타이포 밀도, 시선 이동 구간을 먼저 재정리하고 브랜드 인상이 더 명확하게 보이는 솔루션을 이용하여 사이트를 구축하였습니다",
        ],
      },
      {
        label: "Process",
        title: "정리한 작업 범위",
        paragraphs: [
          "메인 화면의 레이아웃 정보 배치, 주요 뎁스 간 리듬, 운영 시 실무자가 사용하기 편한 구조를 함께 점검했습니다.",
        ],
        bullets: [
          "메인 시각 구조 재정리",
          "결제 및 게시판 기능 튜닝",
          "반응형 화면 밀도 조정",
          "관리자 운영 편의성 고려",
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
    title: "문의와 결제, 확인 단계가 자연스럽게 이어지도록 흐름을 설계하였습니다",
    description:
      "사용자 입력, 관리자 확인, 결제 연결, 후속 응대까지 하나의 흐름으로 보며 끊기지 않는 경험을 만들기 위해 게시판과 결제 관련 화면을 함께 다뤘습니다.",
    tools: ["PHP", "JavaScript", "게시판 연동", "PG 연동"],
    techniques: ["문의 플로우 설계", "결제 단계 연결", "운영 확인 프로세스"],
    imagery: ["Inquiry Form", "Payment Flow", "Admin Checkpoint"],
    cover: "/images/card/project02img01.jpg",
    action: {
      label: "View",
      href: "/images/card/project02img02.jpg",
      openInNewTab: true,
    },
    detailBlocks: [
      {
        label: "Overview",
        title: "프로젝트 개요",
        paragraphs: [
          "문의에서 끝나는 것이 아니라 실제 결제와 확인 단계까지 이어지는 흐름이 자연스럽게 연결되도록 설계하는 작업이 필요했습니다",
          "사용자 입장에서는 입력과 결제가 부드럽게 이어져야 했고, 운영자 입장에서는 문의 확인과 처리 흐름이 명확해야 했습니다",
        ],
      },
      {
        label: "Flow",
        title: "핵심 플로우",
        paragraphs: [
          "입력 → 검토 → 결제 → 후속 처리로 이어지는 흐름을 한 덩어리로 보고, 끊기는 지점을 줄이는 방향으로 구성했습니다",
          "가비아 씨엔에스 맞춤개발팀과 협업하여 기존 솔루션에 없는 기능을 추가하였습니다",
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
          "단순 기능 연결이 아니라 사용성과 운영 프로세스를 함께 본 점이 중요했습니다. 실제 고객과 소통하는 서비스 화면과 관리 흐름을 동시에 다루는 경험이었습니다.",
        ],
      },
    ],
  },
  {
    id: "project-ux",
    step: "3-3",
    category: "브랜딩 카페24 튜닝",
    title: "미스코코의 브랜딩 컨셉을 새로 정리하고, 그에 맞춰 홈페이지를 리뉴얼 및 튜닝했습니다",
    description:
      "홈페이지와 쇼핑몰에서 이탈이 생기기 쉬운 구간을 중심으로 정보 구조와 시선 흐름을 정리하고, 문의와 구매 전환 구간을 더 명확하게 다듬었습니다.",
    tools: ["Cafe24", "JavaScript", "아임웹", "Figma"],
    techniques: ["사용자 여정 점검", "상세/문의 흐름 개선", "전환 구간 정리"],
    imagery: ["Customer Journey", "Detail Page", "Conversion Point"],
    cover: "/images/card/project03img01.jpg",
    action: {
      label: "View",
      href: "https://misscoco.co.kr",
      openInNewTab: true,
    },
    detailBlocks: [
      {
        label: "Overview",
        title: "프로젝트 개요",
        paragraphs: [
          "브랜드 인상이 더 선명하게 전달되도록 미스코코의 컨셉을 새롭게 정리 후 상품 이미지와 레이아웃이 사용자에게 더 돋보이도록 세부 화면을 리뉴얼",
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
          "그래서 브랜드가 전달하고자 하는 분위기와 상품의 매력이 더 잘 드러나도록 메인 화면과 주요 페이지 구조를 리뉴얼하고, 카페24 환경에 맞춰 실제 운영에 필요한 부분까지 함께 튜닝했습니다",
          "사용자가 판단해야 하는 순간에 필요한 정보가 더 명확하게 보이도록 하는 데 집중했고, 화면이 단순해 보이더라도 실제 행동 흐름이 자연스럽게 이어지도록 설계했습니다",
        ],
      },
    ],
  },
  {
    id: "project-marketing",
    step: "3-4",
    category: "광고 운영 및 마케팅 협업",
    title: "사이트 구축 이후 광고 및 홍보를 통해 유입과 전환까지 이어지도록 운영하였습니다",
    description:
      "검색광고, 기획전, 제휴 협업, 운영 데이터를 연결해서 단순 노출이 아니라 실제 반응과 전환으로 이어지는 접점을 찾고 조정한 경험을 담았습니다.",
    tools: ["네이버 검색광고", "GA4", "기획전 운영", "제휴 협업"],
    techniques: ["유입 분석", "성과 흐름 점검", "운영/마케팅 협업"],
    imagery: ["Campaign Overview", "Traffic Data", "Promotion Assets"],
    cover: "/images/card/project04img01.jpg",
    action: {
      label: "View",
      href: "/images/card/project04img01.jpg",
      openInNewTab: true,
    },
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
          "검색광고, 프모로션 기획전 운영, 제휴 협업 등 개별 작업을 따로 보지 않고 실제 반응과 운영 연결까지 한 흐름으로 이해하려고 했습니다.",
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

const cn = (...classNames: Array<string | false | null | undefined>) => {
  return classNames.filter(Boolean).join(" ");
};

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
  const infoGroups = useMemo(
    () => [
      {
        label: "Tools",
        items: currentWork.tools,
      },
      {
        label: "Techniques",
        items: currentWork.techniques,
      },
      {
        label: "Imagery",
        items: currentWork.imagery,
      },
    ],
    [currentWork]
  );

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
    if (
      nextIndex < 0 ||
      nextIndex >= works.length ||
      nextIndex === currentIndex
    ) {
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
    <main className={styles.page}>
      <Header />

      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.topbar}>
            <p className={styles.topbarLabel}>Projects</p>

            <p className={styles.topbarCount}>
              {currentWork.step} · {String(currentIndex + 1).padStart(2, "0")} /{" "}
              {String(works.length).padStart(2, "0")}
            </p>
          </div>

          <div className={styles.mobileCategoryWrap}>
            <div className={styles.mobileCategoryRow}>
              {mobilePrimaryWorks.map((work, index) => {
                const isActive = index === currentIndex;

                return (
                  <button
                    key={work.id}
                    type="button"
                    onClick={() => applyIndexImmediately(index)}
                    className={cn(
                      styles.mobileCategoryChip,
                      isActive && styles.mobileCategoryChipActive
                    )}
                  >
                    {work.step} · {work.category}
                  </button>
                );
              })}

              {mobileHiddenWorks.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMobileMoreOpen((prev) => !prev)}
                  className={cn(
                    styles.mobileCategoryChip,
                    (isHiddenWorkActive || mobileMoreOpen) &&
                      styles.mobileCategoryChipActive
                  )}
                >
                  More
                </button>
              )}
            </div>

            {mobileMoreOpen && mobileHiddenWorks.length > 0 && (
              <div className={styles.mobileMorePanel}>
                <div className={styles.mobileMoreGrid}>
                  {mobileHiddenWorks.map((work, hiddenIndex) => {
                    const actualIndex = hiddenIndex + MOBILE_PRIMARY_COUNT;
                    const isActive = actualIndex === currentIndex;

                    return (
                      <button
                        key={work.id}
                        type="button"
                        onClick={() => applyIndexImmediately(actualIndex)}
                        className={cn(
                          styles.mobileMoreButton,
                          isActive && styles.mobileMoreButtonActive
                        )}
                      >
                        <p className={styles.mobileMoreStep}>{work.step}</p>
                        <p className={styles.mobileMoreCategory}>{work.category}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className={styles.desktopLayout}>
            <aside className={styles.desktopAside}>
              <div>
                <p className={styles.asideEyebrow}>Category</p>

                <div className={styles.desktopCategoryGrid}>
                  {works.map((work, index) => {
                    const isActive = index === currentIndex;

                    return (
                      <button
                        key={work.id}
                        type="button"
                        onClick={() => applyIndexImmediately(index)}
                        className={cn(
                          styles.desktopCategoryButton,
                          isActive && styles.desktopCategoryButtonActive
                        )}
                      >
                        <p className={styles.desktopCategoryStep}>{work.step}</p>
                        <p className={styles.desktopCategoryName}>{work.category}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className={styles.asideDescription}>
                메인 세션 3의 더보기 버튼과 같은 기준으로 연결되어 원하는 프로젝트 위치로
                바로 이동할 수 있습니다.
              </p>
            </aside>

            <div ref={desktopScrollRef} className={styles.desktopContentScroll}>
              <div className={styles.desktopContentInner}>
                <div className={styles.desktopTitleWrap}>
                  <p className={styles.contentEyebrow}>{currentWork.category}</p>
                  <h1 ref={desktopTitleRef} className={styles.desktopTitle}>
                    {currentWork.title}
                  </h1>
                </div>

                <div className={styles.coverFrame}>
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className={styles.coverButton}
                  >
                    <img
                      src={currentWork.cover}
                      alt={currentWork.title}
                      className={styles.coverImage}
                    />
                  </button>
                </div>

                <div className={styles.detailBlockGrid}>
                  {currentWork.detailBlocks.map((block) => (
                    <section
                      key={`${currentWork.id}-${block.label}`}
                      className={styles.detailCard}
                    >
                      <p className={styles.detailLabel}>{block.label}</p>
                      <h2 className={styles.detailTitle}>{block.title}</h2>

                      <div className={styles.detailParagraphs}>
                        {block.paragraphs.map((paragraph) => (
                          <p key={paragraph} className={styles.detailParagraph}>
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      {block.bullets && block.bullets.length > 0 && (
                        <ul className={styles.detailBulletGrid}>
                          {block.bullets.map((bullet) => (
                            <li key={bullet} className={styles.detailBulletItem}>
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

            <div ref={desktopSideRef} className={styles.desktopInfoColumn}>
              <div className={styles.infoCard}>
                <p className={styles.infoDescription}>{currentWork.description}</p>

                <div className={styles.infoGroupGrid}>
                  {infoGroups.map((group) => (
                    <div key={group.label} className={styles.infoGroup}>
                      <p className={styles.infoGroupLabel}>{group.label}</p>
                      <ul className={styles.infoList}>
                        {group.items.map((item) => (
                          <li key={item} className={styles.infoListItem}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <a
                  href={currentWork.action.href}
                  target={currentWork.action.openInNewTab ? "_blank" : undefined}
                  rel={currentWork.action.openInNewTab ? "noreferrer" : undefined}
                  download={currentWork.action.downloadFileName}
                  className={styles.viewButton}
                >
                  {currentWork.action.label}
                </a>
              </div>
            </div>
          </div>

          <div className={styles.mobileLayout}>
            <div className={styles.mobileTitleWrap}>
              <p className={styles.contentEyebrow}>{currentWork.category}</p>
              <h1 ref={mobileTitleRef} className={styles.mobileTitle}>
                {currentWork.title}
              </h1>
            </div>

            <div ref={mobileScrollRef} className={styles.mobileContentScroll}>
              <div className={styles.mobileContentInner}>
                <div className={styles.mobileCoverFrame}>
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className={styles.coverButton}
                  >
                    <img
                      src={currentWork.cover}
                      alt={currentWork.title}
                      className={styles.coverImage}
                    />
                  </button>
                </div>

                <div className={styles.mobileDetailGrid}>
                  {currentWork.detailBlocks.map((block) => (
                    <section
                      key={`${currentWork.id}-mobile-${block.label}`}
                      className={styles.mobileDetailCard}
                    >
                      <p className={styles.detailLabel}>{block.label}</p>
                      <h2 className={styles.mobileDetailTitle}>{block.title}</h2>

                      <div className={styles.detailParagraphs}>
                        {block.paragraphs.map((paragraph) => (
                          <p key={paragraph} className={styles.mobileDetailParagraph}>
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      {block.bullets && block.bullets.length > 0 && (
                        <ul className={styles.mobileDetailBulletGrid}>
                          {block.bullets.map((bullet) => (
                            <li key={bullet} className={styles.mobileDetailBulletItem}>
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

            <div ref={mobileInfoRef} className={styles.mobileInfoCard}>
              <p className={styles.mobileInfoDescription}>{currentWork.description}</p>

              <div className={styles.mobileInfoGroupGrid}>
                {infoGroups.map((group) => (
                  <div key={group.label} className={styles.infoGroup}>
                    <p className={styles.infoGroupLabel}>{group.label}</p>
                    <ul className={styles.infoList}>
                      {group.items.map((item) => (
                        <li key={item} className={styles.infoListItem}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <a
                href={currentWork.action.href}
                target={currentWork.action.openInNewTab ? "_blank" : undefined}
                rel={currentWork.action.openInNewTab ? "noreferrer" : undefined}
                download={currentWork.action.downloadFileName}
                className={styles.viewButton}
              >
                {currentWork.action.label}
              </a>
            </div>
          </div>

          <div className={styles.bottomNavigation}>
            <div className={styles.bottomNavigationGroup}>
              <button
                type="button"
                onClick={() => animateTo(currentIndex - 1)}
                className={styles.bottomNavigationButton}
              >
                Prev
              </button>

              <button
                type="button"
                onClick={() => animateTo(currentIndex + 1)}
                className={styles.bottomNavigationButton}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalPanel}>
            <div className={styles.modalHeader}>
              <p className={styles.modalMeta}>
                {currentWork.step} · {currentWork.category}
              </p>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className={styles.modalCloseButton}
              >
                Close
              </button>
            </div>

            <div className={styles.modalBody}>
              <h2 className={styles.modalTitle}>{currentWork.title}</h2>

              <p className={styles.modalDescription}>{currentWork.description}</p>

              <div className={styles.modalInfoGrid}>
                {infoGroups.map((group) => (
                  <div key={group.label}>
                    <p className={styles.modalInfoLabel}>{group.label}</p>
                    <ul className={styles.modalInfoList}>
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className={styles.modalDetailGrid}>
                {currentWork.detailBlocks.map((block) => (
                  <section
                    key={`${currentWork.id}-modal-${block.label}`}
                    className={styles.modalDetailCard}
                  >
                    <p className={styles.modalDetailLabel}>{block.label}</p>
                    <h3 className={styles.modalDetailTitle}>{block.title}</h3>

                    <div className={styles.modalDetailParagraphs}>
                      {block.paragraphs.map((paragraph) => (
                        <p key={paragraph} className={styles.modalDetailParagraph}>
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {block.bullets && block.bullets.length > 0 && (
                      <ul className={styles.modalDetailBulletGrid}>
                        {block.bullets.map((bullet) => (
                          <li key={bullet} className={styles.modalDetailBulletItem}>
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
