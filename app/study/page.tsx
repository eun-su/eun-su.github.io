import Header from "@/components/Header";

const posts = [
  {
    category: "JavaScript",
    title: "비동기 흐름을 이해하는 방식",
    excerpt:
      "Promise, async/await, event loop를 실전 코드 관점에서 다시 정리한 기록입니다.",
  },
  {
    category: "React",
    title: "컴포넌트 구조를 나누는 기준",
    excerpt:
      "재사용성과 가독성, 상태 분리 관점에서 컴포넌트를 설계하는 기준을 정리했습니다.",
  },
  {
    category: "SQL",
    title: "윈도우 함수와 서브쿼리 다시 보기",
    excerpt:
      "시험 대비가 아니라 실무에서 어떻게 읽고 써야 하는지를 중심으로 다시 공부한 내용입니다.",
  },
];

export default function StudyPage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-black">
      <Header />

      <section className="px-6 pt-28 pb-16 md:px-10 md:pt-36 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs uppercase tracking-[0.22em] opacity-60 md:text-sm">
            Study Notes
          </p>
          <h1 className="max-w-4xl text-[36px] leading-[0.95] tracking-[-0.04em] md:text-[84px]">
            Notes on languages, frameworks, and the way I learn.
          </h1>

          <div className="mt-16 grid gap-6">
            {posts.map((post, index) => (
              <article
                key={index}
                className="rounded-[28px] border border-black/10 bg-white p-6 md:p-8"
              >
                <p className="mb-3 text-xs uppercase tracking-[0.18em] opacity-50">
                  {post.category}
                </p>
                <h2 className="text-2xl tracking-[-0.03em] md:text-4xl">
                  {post.title}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-[1.8] opacity-75 md:text-base">
                  {post.excerpt}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}