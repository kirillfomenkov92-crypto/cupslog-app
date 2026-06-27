import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-56px)] md:min-h-dvh px-6 text-center">
      <p className="text-7xl font-bold text-chip mb-4 tabular-nums select-none">404</p>
      <h1 className="text-xl font-semibold text-prose mb-2">Страница не найдена</h1>
      <p className="text-dim text-sm mb-8">Такой страницы не существует или она была удалена.</p>
      <Link
        href="/"
        className="inline-block bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
      >
        На главную
      </Link>
    </div>
  );
}
