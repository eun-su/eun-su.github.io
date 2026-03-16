import Header from "@/components/Header";

const favorites = [
  {
    type: "Music",
    title: "잔잔한 리듬과 긴 호흡을 가진 음악",
    note: "작업할 때 집중을 잃지 않게 해주는 곡들을 오래 듣는 편입니다.",
  },
  {
    type: "Books",
    title: "구조와 언어가 또렷한 책",
    note: "문장이 분명하고 생각이 정리되는 책에 자주 끌립니다.",
  },
  {
    type: "Quotes",
    title: "과하지 않지만 오래 남는 문장",
    note: "짧지만 오래 생각하게 만드는 문장을 따로 모아두는 편입니다.",
  },
];

export default function FavoritesPage() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <Header />

      <section className="px-6 pt-28 pb-16 md:px-10 md:pt-36 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs uppercase tracking-[0.22em] opacity-60 md:text-sm">
            Favorites
          </p>
          <h1 className="max-w-4xl text-[36px] leading-[0.95] tracking-[-0.04em] md:text-[84px]">
            Things I return to: music, books, lines, and quiet personal tastes.
          </h1>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {favorites.map((item, index) => (
              <article
                key={index}
                className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-8"
              >
                <p className="mb-3 text-xs uppercase tracking-[0.18em] opacity-50">
                  {item.type}
                </p>
                <h2 className="text-2xl tracking-[-0.03em] md:text-3xl">
                  {item.title}
                </h2>
                <p className="mt-4 text-sm leading-[1.8] opacity-75 md:text-base">
                  {item.note}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}