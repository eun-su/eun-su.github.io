import type { MainSection, ProjectCard } from "@/components/home/home.types";

export const homeSections: MainSection[] = [
  {
    id: "cover",
    indexLabel: "01",
    eyebrow: "",
    title: "",
    desc: "",
    highlight: "O · ㅡ · L · A(ㅅ) · T",
    mode: "cover",
  },
  {
    id: "intro",
    indexLabel: "02",
    eyebrow: "About / Introduction",
    title: "구조를 설계하고, 화면을 구현하고, 흐름을 다듬는 사람입니다.",
    desc: "웹 퍼블리싱과 프론트엔드 구현을 기반으로 브랜드의 분위기와 사용자 경험이 자연스럽게 이어지는 화면을 설계합니다.",
    mode: "intro",
    tags: ["React", "TypeScript", "SCSS", "Publishing", "Interaction"],
    bullets: [
      "디자인 의도를 실제 서비스 화면으로 정교하게 구현합니다.",
      "운영과 유지보수까지 고려해 구조를 먼저 정리합니다.",
      "브랜드 인상과 사용 흐름이 함께 살아 있는 인터페이스를 지향합니다.",
    ],
    stats: [
      { label: "Focus", value: "Frontend + Publishing" },
      { label: "Approach", value: "Structure before Motion" },
      { label: "Strength", value: "Design to Build" },
    ],
  },
  {
    id: "work-cards",
    indexLabel: "03",
    eyebrow: "Works / Selected Projects",
    title: "스크롤마다 한 장씩 넘어가는 작업 소개",
    desc: "3-1, 3-2, 3-3, 3-4의 작업 소개 카드를 깊이감 있게 한 장씩 넘기며 보여줍니다.",
    mode: "cards",
  },
  {
    id: "design",
    indexLabel: "04",
    eyebrow: "Design Works",
    title: "브랜드의 인상을 만드는 시각 작업도 함께 진행해 왔습니다.",
    desc: "배너, BI·CI, 패키지, 콘텐츠 디자인, 이미지 보정과 촬영 관련 작업까지 폭넓게 다뤄 왔습니다.",
    mode: "design",
    tags: ["Banner", "BI / CI", "Package", "Content", "Retouch"],
    bullets: [
      "브랜드 톤과 채널 목적에 맞는 시각 언어를 정리했습니다.",
      "웹과 오프라인을 넘나드는 일관된 인상을 만들고자 했습니다.",
      "디자인 페이지로 이어지는 포트폴리오 관문 역할을 담당합니다.",
    ],
    links: [{ label: "Design Page", href: "/design" }],
  },
  {
    id: "marketing",
    indexLabel: "05",
    eyebrow: "Marketing Works",
    title: "마케팅 관점에서도 흐름과 전환을 다뤄 왔습니다.",
    desc: "검색광고, GA4, 기획전 운영, 제휴 협업, 이커머스 운영 연결 경험을 바탕으로 성과 흐름을 이해하며 작업했습니다.",
    mode: "marketing",
    bullets: [
      "네이버 검색광고와 구글 분석 도구를 바탕으로 유입과 전환을 살폈습니다.",
      "쇼핑몰 기획전과 제휴 협업을 통해 상품 노출과 운영 흐름을 조정했습니다.",
      "디자인과 개발, 운영이 따로 놀지 않도록 마케팅 관점에서 연결점을 찾았습니다.",
    ],
    links: [{ label: "Favorites / Archive", href: "/favorites" }],
  },
  {
    id: "contact",
    indexLabel: "06",
    eyebrow: "Contact / SNS / Links",
    title: "연결될 준비가 되어 있습니다.",
    desc: "프로젝트 제안, 협업 문의, 포트폴리오 관련 연락은 아래 채널을 통해 남겨주세요.",
    mode: "contact",
    links: [
      { label: "Email", href: "mailto:your-email@example.com" },
      { label: "Phone", href: "tel:+820000000000" },
      { label: "LinkedIn", href: "https://www.linkedin.com/" },
      { label: "GitHub", href: "https://github.com/eun-su/eun-su.github.io" },
      { label: "Behance", href: "https://www.behance.net/" },
    ],
    bullets: [
      "감사합니다. 화면과 구조, 경험을 함께 다듬는 일을 계속하고 싶습니다.",
      "필요한 역할과 문제 정의가 있다면 편하게 이야기해주세요.",
    ],
  },
];

export const homeProjectCards: ProjectCard[] = [
  {
    step: "3-1",
    title: "문의와 결제를 하나의 흐름으로 연결한 게시판 프로젝트",
    desc: "단순 게시판이 아니라 입력, 확인, 결제, 관리까지 이어지는 실제 운영 흐름을 구조화한 프로젝트입니다.",
    meta: ["Custom Board", "Payment Flow", "UX Structure"],
  },
  {
    step: "3-2",
    title: "리뉴얼과 플랫폼 전환의 기준을 다시 설계했습니다.",
    desc: "기존 환경의 구조적 문제와 사용성 문제를 분석하고, 더 적절한 플랫폼으로 방향을 정리한 리뉴얼 프로젝트입니다.",
    meta: ["Renewal", "Commerce", "Migration"],
  },
  {
    step: "3-3",
    title: "홈페이지 구축과 쇼핑몰 튜닝을 다양한 환경에서 진행했습니다.",
    desc: "카페24, 아임웹, 고도몰 등 서로 다른 운영 환경에서 필요한 기능과 화면을 빠르게 조정해 왔습니다.",
    meta: ["Cafe24", "Godomall", "I’mweb"],
  },
  {
    step: "3-4",
    title: "문제를 발견하고 개선 기준을 만드는 방식으로 성장했습니다.",
    desc: "단순 제작을 넘어서 왜 불편한지, 무엇이 더 좋아져야 하는지 기준을 세우며 작업해 왔습니다.",
    meta: ["Problem Solving", "Operation", "Improvement"],
  },
];