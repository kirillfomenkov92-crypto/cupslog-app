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
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      <p className="text-6xl font-bold text-gray-700 mb-4">500</p>
      <h1 className="text-2xl font-semibold mb-2">Что-то пошло не так</h1>
      <p className="text-gray-400 mb-8">Произошла неожиданная ошибка. Попробуй ещё раз.</p>
      <button
        onClick={reset}
        className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
      >
        Попробовать снова
      </button>
    </div>
  );
}
