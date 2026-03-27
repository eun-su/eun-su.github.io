import Header from "@/components/Header";

const works = [
  {
    category: "Branding",
    title: "브랜드 인상을 정리하는 시각 작업 아카이브",
    excerpt:
      "브랜드 톤, 로고 응용, 기본 키비주얼과 같은 시각 시스템을 정리하며 방향성을 다듬은 작업들입니다.",
  },
  {
    category: "Editorial",
    title: "레이아웃과 타이포 중심의 디자인 정리",
    excerpt:
      "포스터, 상세 페이지, 콘텐츠 레이아웃처럼 정보의 흐름과 밀도를 조절하는 디자인 작업을 모아두었습니다.",
  },
  {
    category: "Interface",
    title: "화면 인상과 사용성을 함께 보는 UI 시안",
    excerpt:
      "컬러, 여백, 이미지 비율, 인터페이스 리듬을 실험하며 실제 화면 감도를 맞춰본 디자인 시안과 메모입니다.",
  },
];

export default function DesignPage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-black">
      <Header />

      <section className="px-6 pt-28 pb-16 md:px-10 md:pt-36 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs uppercase tracking-[0.22em] opacity-60 md:text-sm">
            Design Works
          </p>
          <h1 className="max-w-4xl text-[36px] leading-[0.95] tracking-[-0.04em] md:text-[84px]">
            Selected visual works, layout studies, and interface explorations.
          </h1>

          <div className="mt-16 grid gap-6">
            {works.map((work, index) => (
              <article
                key={index}
                className="rounded-[28px] border border-black/10 bg-white p-6 md:p-8"
              >
                <p className="mb-3 text-xs uppercase tracking-[0.18em] opacity-50">
                  {work.category}
                </p>
                <h2 className="text-2xl tracking-[-0.03em] md:text-4xl">
                  {work.title}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-[1.8] opacity-75 md:text-base">
                  {work.excerpt}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
