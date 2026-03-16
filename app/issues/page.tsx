import Header from "@/components/Header";

const issues = [
  {
    tag: "Frontend",
    title: "웹 인터랙션에서 과한 애니메이션은 언제 문제가 되는가",
    date: "2026.03",
  },
  {
    tag: "Design",
    title: "레이아웃보다 타이밍이 먼저 인상을 만드는 경우",
    date: "2026.03",
  },
  {
    tag: "Career",
    title: "포트폴리오 사이트에서 정보량과 인상의 균형",
    date: "2026.03",
  },
];

export default function IssuesPage() {
  return (
    <main className="min-h-screen bg-neutral-100 text-black">
      <Header />

      <section className="px-6 pt-28 pb-16 md:px-10 md:pt-36 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs uppercase tracking-[0.22em] opacity-60 md:text-sm">
            Issue Board
          </p>
          <h1 className="max-w-4xl text-[36px] leading-[0.95] tracking-[-0.04em] md:text-[84px]">
            Recent thoughts, issues, and observations I want to keep track of.
          </h1>

          <div className="mt-16 overflow-hidden rounded-[28px] border border-black/10 bg-white">
            {issues.map((issue, index) => (
              <div
                key={index}
                className="grid gap-4 border-b border-black/10 px-6 py-6 last:border-b-0 md:grid-cols-12 md:px-8"
              >
                <div className="md:col-span-2">
                  <p className="text-xs uppercase tracking-[0.18em] opacity-45">
                    {issue.tag}
                  </p>
                </div>
                <div className="md:col-span-8">
                  <h2 className="text-xl tracking-[-0.03em] md:text-3xl">
                    {issue.title}
                  </h2>
                </div>
                <div className="md:col-span-2 md:text-right">
                  <p className="text-sm opacity-50">{issue.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}