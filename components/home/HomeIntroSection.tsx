"use client";

import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { MainSection } from "./home.types";
import styles from "./HomeIntroSection.module.scss";

type ProfilePhoto = {
  label: string;
  role: string;
  src: string;
};

type EducationItem = {
  label: string;
  value: string;
  note?: string;
};

type ToolGroup = {
  title: string;
  items: string[];
};

type CareerItem = {
  title: string;
  desc: string;
};

type ProjectItem = {
  title: string;
  desc: string;
};

const profilePhotos: ProfilePhoto[] = [
  {
    label: "Formal",
    role: "정장 프로필",
    src: "/images/intro/profile-formal.jpg",
  },
  {
    label: "Casual",
    role: "사복 프로필",
    src: "/images/intro/profile-casual.jpg",
  },
];

const companyHistory = [
  "오브리에 스튜디오 디자인팀",
  "럭스애비뉴 웹디자이너 · 프로그래머",
  "럭스애비뉴 / 미스코코 온라인 마케터",
];

const educationItems: EducationItem[] = [
  {
    label: "학교 / 전공",
    value: "서울디지털대학교 · 시각디자인 / 컴퓨터공학 복수전공",
  },
  {
    label: "교육기관 / 과정",
    value: "대우직업전문 · 메가스터디 · SBS 아카데미",
  },
];

const toolGroups: ToolGroup[] = [
  {
    title: "Design",
    items: ["Figma", "Photoshop", "Illustrator", "XD"],
  },
  {
    title: "Frontend / Publishing",
    items: [
      "HTML5",
      "CSS3",
      "SCSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "jQuery",
      "Bootstrap",
      "Vue.js",
    ],
  },
  {
    title: "Commerce / Platform",
    items: ["Cafe24", "고도몰", "아임웹", "GA4", "ERP"],
  },
];

const certifications = [
  "웹디자인기능사",
  "컴퓨터그래픽기능사",
  "GTQ",
];

const identityCards = [
  { title: "Marketer" },
  { title: "UIUX Designer" },
  { title: "Web Publisher" },
];

const careerItems: CareerItem[] = [
  {
    title: "서비스 기획부터 디자인 그리고 개발까지",
    desc: "요구사항을 실제 서비스 화면으로 옮기고, 퍼블리싱과 프론트엔드 구현, 운영 및 대응",
  },
  {
    title: "실무 중심 협업 경험",
    desc: "이커머스 연결과 QA테스트, 관리자 데이터, 게시판 · 문의 · 결제 흐름까지 현업에서 바로 오류 확인, 개발 PL 실무자와 현업",
  },
  {
    title: "콘텐츠 입력 및 운영",
    desc: "직접 제작한 서비스를 배포, 사용자 문의 대응 및 개편, 광고 집행 및 데이터 분석",
  },
];

const projectItems: ProjectItem[] = [
  {
    title: "홈페이지 구축 및 리뉴얼 · 카페24 튜닝",
    desc: "브랜드 기업 사이트 신규 구축, 구조 개편, 화면 리뉴얼과 함께 화면 개선, 운영 편의성 보완",
  },
  {
    title: "문의 · 게시판 · 결제 서비스 모델 설계",
    desc: "입력 확인 응대 결제까지 이어지는 게시판 형태 문의 서비스 제작",
  },
  {
    title: "마케팅 실행과 유입과 전환 분석",
    desc: "GA4, 네이버 검색광고, 기획전 운영, 제휴 협업 기반 유입과 전환 관점까지 함께 고려",
  },
];

function useIsMobileLayout() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const mediaQuery = window.matchMedia("(max-width: 1024px)");

    const sync = () => {
      setIsMobileLayout(mediaQuery.matches);
    };

    sync();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", sync);
      return () => mediaQuery.removeEventListener("change", sync);
    }

    mediaQuery.addListener(sync);
    return () => mediaQuery.removeListener(sync);
  }, []);

  return {
    isMounted,
    isMobileLayout,
  };
}

type ProfileIdentityPanelProps = {
  activePhotoIndex: number;
  onPrevPhoto: () => void;
  onNextPhoto: () => void;
  mobile?: boolean;
};

const ProfileIdentityPanel = memo(function ProfileIdentityPanel({
  activePhotoIndex,
  onPrevPhoto,
  onNextPhoto,
  mobile = false,
}: ProfileIdentityPanelProps) {
  return (
    <article
      className={`${styles.panel} ${styles.profileTallPanel} ${
        mobile ? styles.mobilePanel : ""
      }`}
    >
      <div className={`${styles.panelShell} ${styles.panelShellPlain}`}>
        <div className={styles.panelHeader}>
          <p className={styles.panelLabel}>Profile · Identity</p>
          <div className={styles.panelLine} />
        </div>

        <div className={styles.profileTallBody}>
          <section className={styles.profileTallTop}>
            <div className={styles.photoStage}>
              <div className={styles.photoViewport}>
                {profilePhotos.map((photo, index) => (
                  <div
                    key={photo.src}
                    className={`${styles.photoSlide} ${
                      index === activePhotoIndex ? styles.photoSlideActive : ""
                    }`}
                    style={{ backgroundImage: `url(${photo.src})` }}
                    aria-hidden={index !== activePhotoIndex}
                  />
                ))}
              </div>

              <div className={styles.photoControls}>
                <button
                  type="button"
                  className={styles.photoButton}
                  onClick={onPrevPhoto}
                  aria-label="이전 사진"
                >
                  &lt;
                </button>
                <button
                  type="button"
                  className={styles.photoButton}
                  onClick={onNextPhoto}
                  aria-label="다음 사진"
                >
                  &gt;
                </button>
              </div>
            </div>

            <div className={styles.profileNameBlock}>
              <p className={styles.profileNameEn}>KIM EUNSU</p>
              <p className={styles.profileNameKo}>김은수</p>
            </div>
          </section>

          <section className={styles.profileTallBottom}>
            <div className={styles.identityList}>
              {identityCards.map((item) => (
                <article key={item.title} className={styles.identityCard}>
                  <h3 className={styles.identityTitle}>{item.title}</h3>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </article>
  );
});

type BasicPanelProps = {
  mobile?: boolean;
};

const MetaPanel = memo(function MetaPanel({ mobile = false }: BasicPanelProps) {
  return (
    <article
      className={`${styles.panel} ${styles.profileMetaPanel} ${
        mobile ? styles.mobilePanel : ""
      }`}
    >
      <div className={styles.panelHeader}>
        <p className={styles.panelLabel}>Previous Experience</p>
        <div className={styles.panelLine} />
      </div>

      <div className={styles.metaSplit}>
        <section className={styles.metaSection}>
          <ul className={styles.companyList}>
            {companyHistory.map((item) => (
              <li key={item} className={styles.companyItem}>
                <span className={styles.companyDot} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.bottomMetaGrid}>
          <div className={styles.metaSection}>
            <div className={`${styles.subHeader} ${styles.sectionMarginTop}`}>
              <p className={styles.subHeaderTitle}>Education</p>
            </div>

            <ul className={styles.infoList}>
              {educationItems.map((item) => (
                <li key={item.label} className={styles.infoItem}>
                  <p className={styles.infoLabel}>{item.label}</p>
                  <p className={styles.infoValue}>{item.value}</p>
                  {item.note ? (
                    <p className={styles.infoNote}>{item.note}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.metaSection}>
            <div className={`${styles.subHeader} ${styles.sectionMarginTop}`}>
              <p className={styles.subHeaderTitle}>Certification</p>
            </div>

            <ul className={styles.certificateList}>
              {certifications.map((item) => (
                <li key={item} className={styles.certificateItem}>
                  <span className={styles.certificateDot} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </article>
  );
});

const ToolsPanel = memo(function ToolsPanel({ mobile = false }: BasicPanelProps) {
  return (
    <article
      className={`${styles.panel} ${styles.toolsPanel} ${
        mobile ? styles.mobilePanel : ""
      }`}
    >
      <div className={styles.panelHeader}>
        <p className={styles.panelLabel}>Tools · Languages · Frameworks</p>
        <div className={styles.panelLine} />
      </div>

      <div className={styles.toolsBody}>
        {toolGroups.map((group) => (
          <section key={group.title} className={styles.toolGroup}>
            <h3 className={styles.toolGroupTitle}>{group.title}</h3>

            <ul className={styles.toolList}>
              {group.items.map((item) => (
                <li key={item} className={styles.toolItem}>
                  <span className={styles.toolIcon} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  );
});

const ExperienceWidePanel = memo(function ExperienceWidePanel({
  mobile = false,
}: BasicPanelProps) {
  return (
    <article
      className={`${styles.panel} ${styles.experienceWidePanel} ${
        mobile ? styles.mobilePanel : ""
      }`}
    >
      <div className={`${styles.panelShell} ${styles.panelShellPlain}`}>
        <div className={styles.panelHeader}>
          <p className={styles.panelLabel}>Career · Projects · Experience</p>
          <div className={styles.panelLine} />
        </div>

        <div className={styles.experienceWideBody}>
          <section className={styles.careerSummary}>
            {careerItems.map((item) => (
              <article key={item.title} className={styles.careerCard}>
                <h3 className={styles.careerTitle}>{item.title}</h3>
                <p className={styles.careerDesc}>{item.desc}</p>
              </article>
            ))}
          </section>

          <section className={styles.projectSummary}>
            {/* <div className={styles.subHeader}>
               <p className={styles.subHeaderTitle}>Project Highlights</p> 
            </div> */}

            <ul className={styles.projectList}>
              {projectItems.map((item) => (
                <li key={item.title} className={styles.projectItem}>
                  <p className={styles.projectTitle}>{item.title}</p>
                  <p className={styles.projectDesc}>{item.desc}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </article>
  );
});

export default function HomeIntroSection({ section }: { section: MainSection }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { isMounted, isMobileLayout } = useIsMobileLayout();

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isSectionVisible, setIsSectionVisible] = useState(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionVisible(entry.isIntersecting && entry.intersectionRatio > 0.2);
      },
      {
        threshold: [0, 0.2, 0.35, 0.5],
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isSectionVisible) return;

    const timer = window.setInterval(() => {
      setActivePhotoIndex((prev) => (prev + 1) % profilePhotos.length);
    }, 4200);

    return () => {
      window.clearInterval(timer);
    };
  }, [isSectionVisible]);

  useEffect(() => {
    if (!isDetailModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDetailModalOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isDetailModalOpen]);

  const goPrevPhoto = useCallback(() => {
    setActivePhotoIndex((prev) =>
      prev === 0 ? profilePhotos.length - 1 : prev - 1
    );
  }, []);

  const goNextPhoto = useCallback(() => {
    setActivePhotoIndex((prev) => (prev + 1) % profilePhotos.length);
  }, []);

  const openDetailModal = useCallback(() => {
    setIsDetailModalOpen(true);
  }, []);

  const closeDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
  }, []);

  const profilePanel = (
    <ProfileIdentityPanel
      activePhotoIndex={activePhotoIndex}
      onPrevPhoto={goPrevPhoto}
      onNextPhoto={goNextPhoto}
      mobile={isMounted && isMobileLayout}
    />
  );

  const metaPanel = <MetaPanel mobile={isMounted && isMobileLayout} />;
  const toolsPanel = <ToolsPanel mobile={isMounted && isMobileLayout} />;
  const experiencePanel = (
    <ExperienceWidePanel mobile={isMounted && isMobileLayout} />
  );

  const shouldRenderMobile = isMounted && isMobileLayout;

  return (
    <div ref={sectionRef} className={styles.introSection}>
      <div className={styles.headingBlock}>
        <div className={styles.indexLabel}>{section.indexLabel}</div>

        <div className={styles.headingText}>
          <h2 className={styles.title}>{section.title}</h2>
        </div>
      </div>

      {shouldRenderMobile ? (
        <div className={styles.mobileIntroView}>
          {profilePanel}

          <div className={styles.mobileMoreWrap}>
            <button
              type="button"
              className={styles.mobileMoreButton}
              onClick={openDetailModal}
            >
              더보기
            </button>
          </div>

          {isDetailModalOpen ? (
            <div
              className={styles.mobileModalOverlay}
              onClick={closeDetailModal}
              role="presentation"
            >
              <div
                className={styles.mobileModalPanel}
                role="dialog"
                aria-modal="true"
                aria-label="소개 상세 정보"
                onClick={(event) => event.stopPropagation()}
              >
                <div className={styles.mobileModalHeader}>
                  <p className={styles.mobileModalTitle}>More About Me</p>
                  <button
                    type="button"
                    className={styles.mobileModalClose}
                    onClick={closeDetailModal}
                    aria-label="모달 닫기"
                  >
                    ×
                  </button>
                </div>

                <div className={styles.mobileModalBody}>
                  {metaPanel}
                  {toolsPanel}
                  {experiencePanel}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className={styles.introGrid}>
          {profilePanel}
          {metaPanel}
          {toolsPanel}
          {experiencePanel}
        </div>
      )}
    </div>
  );
}