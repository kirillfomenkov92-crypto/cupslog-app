"use client";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ru">
      <body className="min-h-dvh flex flex-col items-center justify-center bg-canvas text-prose antialiased">
        <p className="text-7xl font-bold text-chip mb-4 tabular-nums select-none">500</p>
        <h1 className="text-xl font-semibold mb-2">Критическая ошибка</h1>
        <p className="text-dim text-sm mb-8">
          Приложение столкнулось с непредвиденной ошибкой.
        </p>
        <button
          onClick={reset}
          className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          Попробовать снова
        </button>
      </body>
    </html>
  );
}
