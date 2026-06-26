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
      <body className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-gray-100">
        <p className="text-6xl font-bold text-gray-700 mb-4">500</p>
        <h1 className="text-2xl font-semibold mb-2">Критическая ошибка</h1>
        <p className="text-gray-400 mb-8">Приложение столкнулось с непредвиденной ошибкой.</p>
        <button
          onClick={reset}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          Попробовать снова
        </button>
      </body>
    </html>
  );
}
