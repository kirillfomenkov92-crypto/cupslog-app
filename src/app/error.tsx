"use client";
import { useEffect } from "react";

export default function Error({
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-56px)] md:min-h-dvh px-6 text-center">
      <p className="text-7xl font-bold text-chip mb-4 tabular-nums select-none">500</p>
      <h1 className="text-xl font-semibold text-prose mb-2">Что-то пошло не так</h1>
      <p className="text-dim text-sm mb-8">Произошла неожиданная ошибка. Попробуй ещё раз.</p>
      <button
        onClick={reset}
        className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
      >
        Попробовать снова
      </button>
    </div>
  );
}
