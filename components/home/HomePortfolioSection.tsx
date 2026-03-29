"use client";

import { useEffect, useMemo, useState } from "react";
import type { MainSection } from "./home.types";
import styles from "./HomePortfolioSection.module.scss";

type Props = {
  section: MainSection;
  onLinkClick?: (href?: string) => void;
};

type MarketingProject = {
  id: string;
  title: string;
  tags: string[];
  imageSrc?: string;
  imageAlt: string;
  goal: string[];
  analysis: string[];
  result: string[];
};

const marketingProjects: MarketingProject[] = [
  {
    id: "marketing-ads",
    title: "광고 집행과 분석 도구를 함께 보며 유입을 관리한 프로젝트",
    tags: [
      "#네이버검색광고",
      "#구글분석도구",
      "#배너제작",
      "#영상제작",
      "#카피라이팅",
      "#키워드관리",
    ],
    imageSrc: "/images/marketing/marketing01.jpg",
    imageAlt: "광고 운영 및 분석 작업 이미지",
    goal: [
      "검색 기반 유입을 더 안정적으로 확보하고 실제 반응이 있는 키워드를 지속적으로 관리하는 것이 목표였습니다.",
      "광고 집행 자체보다도 소재와 문구, 랜딩 연결까지 함께 보며 유입 효율을 높이는 방향으로 접근했습니다.",
    ],
    analysis: [
      "시장 흐름과 사용자 반응을 보며 검색량이 높은 키워드와 실제 전환 가능성이 있는 키워드를 계속 점검했습니다.",
      "배너, 영상, 카피라이팅도 광고 맥락에 맞게 조정하면서 유입 단계에서의 첫 인상을 함께 관리했습니다.",
    ],
    result: [
      "단순 노출이 아니라 유입 흐름과 소재 반응을 같이 보는 실무 감각을 쌓았고, 데이터를 참고해 운영 방향을 조정하는 경험으로 이어졌습니다.",
    ],
  },
  {
    id: "marketing-commerce",
    title: "오픈마켓 · 쇼핑몰 · 라이브 커머스 협업으로 상품 노출을 최적화한 프로젝트",
    tags: [
      "#LF몰",
      "#SSG",
      "#GS홈쇼핑",
      "#코오롱몰",
      "#네이버스토어",
      "#해외쇼핑몰",
      "#라이브커머스",
    ],
    imageSrc: "/images/marketing/marketing02.jpg",
    imageAlt: "오픈마켓 및 이커머스 협업 이미지",
    goal: [
      "각 플랫폼 특성에 맞게 상품이 더 잘 보이도록 구성하고, 기획전과 이벤트를 통해 노출 기회를 넓히는 것이 주요 목표였습니다.",
      "단순 등록이 아니라 어떤 방식으로 보여야 클릭과 유입으로 이어질지를 함께 고민했습니다.",
    ],
    analysis: [
      "플랫폼마다 진열 방식과 반응 포인트가 달라 상세 구성, 대표 이미지, 프로모션 문구, 상품 노출 순서를 계속 조정했습니다.",
      "국내외 쇼핑몰과 라이브 커머스까지 확장해 운영하면서 채널별로 필요한 표현과 노출 포인트를 실무적으로 익혔습니다.",
    ],
    result: [
      "기획전 운영, 상품 노출 최적화, 이벤트 연계 경험이 쌓였고, 협업 채널이 달라져도 운영 논리를 빠르게 맞춰가는 능력을 만들 수 있었습니다.",
    ],
  },
  {
    id: "marketing-service",
    title: "상품 감정 · 매입 · 위탁 판매 서비스를 연결해 지속 이용을 유도한 프로젝트",
    tags: [
      "#상품감정",
      "#매입연결",
      "#위탁판매",
      "#서비스모델",
      "#전문가연결",
      "#고객유도",
    ],
    imageSrc: "/images/marketing/marketing03.jpg",
    imageAlt: "서비스 모델 연결 작업 이미지",
    goal: [
      "상품 감정, 매입, 위탁 판매 같은 서비스를 각각 분리해서 보여주기보다 하나의 연결된 경험으로 이해시키는 것이 중요했습니다.",
      "사용자가 서비스 흐름을 이해하고 반복적으로 찾게 만드는 구조를 만드는 데 초점을 맞췄습니다.",
    ],
    analysis: [
      "전문가와 소비자, 업체 사이에서 어디에서 이탈이 생기고 어떤 정보가 부족한지 살피며 설명 방식과 연결 지점을 정리했습니다.",
      "서비스 소개 화면, 유도 문구, 운영 흐름을 함께 보며 사용자가 다음 행동으로 넘어가기 쉬운 구조를 만들려고 했습니다.",
    ],
    result: [
      "서비스의 기능을 나열하는 것이 아니라 관계와 흐름을 보여주는 방식으로 접근했고, 실제 이용 가능성을 높이는 방향으로 실무를 경험했습니다.",
    ],
  },
];

function ProjectImage({ project }: { project: MarketingProject }) {
  const [hasError, setHasError] = useState(false);

  if (!project.imageSrc || hasError) {
    return (
      <div className={styles.placeholderBox}>
        <span className={styles.placeholderLabel}>Marketing Work</span>
      </div>
    );
  }

  return (
    <img
      src={project.imageSrc}
      alt={project.imageAlt}
      className={styles.projectImage}
      onError={() => setHasError(true)}
    />
  );
}

export default function HomePortfolioSection({ section }: Props) {
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const activeProject = useMemo(() => {
    if (activeProjectIndex === null) {
      return null;
    }

    return marketingProjects[activeProjectIndex] ?? null;
  }, [activeProjectIndex]);

  const openProject = (index: number) => {
    setIsClosing(false);
    setActiveProjectIndex(index);
  };

  const closeModal = () => {
    if (activeProjectIndex === null) {
      return;
    }

    setIsClosing(true);
  };

  const showPrev = () => {
    if (activeProjectIndex === null) {
      return;
    }

    setIsClosing(false);
    setActiveProjectIndex(
      (activeProjectIndex - 1 + marketingProjects.length) % marketingProjects.length
    );
  };

  const showNext = () => {
    if (activeProjectIndex === null) {
      return;
    }

    setIsClosing(false);
    setActiveProjectIndex((activeProjectIndex + 1) % marketingProjects.length);
  };

  useEffect(() => {
    if (activeProjectIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }

      if (event.key === "ArrowLeft") {
        showPrev();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeProjectIndex]);

  const handleOverlayAnimationEnd = () => {
    if (!isClosing) {
      return;
    }

    setActiveProjectIndex(null);
    setIsClosing(false);
  };

  return (
    <>
      <div className={styles.portfolioLayout}>
        <div className={styles.headerRow}>
          <div className={styles.indexLabel}>{section.indexLabel}</div>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>{section.title}</h2>
          </div>
        </div>

        <div className={styles.cardGrid}>
          {marketingProjects.map((project, index) => (
            <article key={project.id} className={styles.card}>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{project.title}</h3>

                <ul className={styles.tagList}>
                  {project.tags.map((tag) => (
                    <li key={tag} className={styles.tagItem}>
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.imageWrap}>
                <ProjectImage project={project} />
              </div>

              <button
                type="button"
                className={styles.ctaButton}
                onClick={() => openProject(index)}
              >
                Read More
              </button>
            </article>
          ))}
        </div>
      </div>

      {activeProject ? (
        <div
          className={`${styles.modalOverlay} ${
            isClosing ? styles.modalOverlayHidden : styles.modalOverlayVisible
          }`}
          onClick={closeModal}
          onAnimationEnd={handleOverlayAnimationEnd}
          onWheelCapture={(event) => event.stopPropagation()}
          onTouchMoveCapture={(event) => event.stopPropagation()}
          role="presentation"
        >
          <div
            className={`${styles.modalDialog} ${
              isClosing ? styles.modalDialogHidden : styles.modalDialogVisible
            }`}
            onClick={(event) => event.stopPropagation()}
            onWheelCapture={(event) => event.stopPropagation()}
            onTouchMoveCapture={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${activeProject.id}-title`}
          >
            <div className={styles.modalHead}>
              <div>
                <p className={styles.modalEyebrow}>Marketing Project</p>
                <p className={styles.modalCounter}>
                  {String((activeProjectIndex ?? 0) + 1).padStart(2, "0")} / {" "}
                  {String(marketingProjects.length).padStart(2, "0")}
                </p>
              </div>

              <button
                type="button"
                className={styles.modalClose}
                onClick={closeModal}
              >
                Close
              </button>
            </div>

            <div
              className={styles.modalBody}
              onWheelCapture={(event) => event.stopPropagation()}
              onTouchMoveCapture={(event) => event.stopPropagation()}
            >
              <h3 id={`${activeProject.id}-title`} className={styles.modalTitle}>
                {activeProject.title}
              </h3>

              <section className={styles.modalSection}>
                <p className={styles.modalSectionLabel}>Goal</p>
                <div className={styles.modalParagraphs}>
                  {activeProject.goal.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
              </section>

              <section className={styles.modalSection}>
                <p className={styles.modalSectionLabel}>Analysis</p>
                <div className={styles.modalParagraphs}>
                  {activeProject.analysis.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
              </section>

              <section className={styles.modalSection}>
                <p className={styles.modalSectionLabel}>Result</p>
                <div className={styles.modalParagraphs}>
                  {activeProject.result.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
              </section>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.modalNavButton}
                onClick={showPrev}
              >
                Prev
              </button>
              <button
                type="button"
                className={styles.modalNavButtonPrimary}
                onClick={showNext}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
