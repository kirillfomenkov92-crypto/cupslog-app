import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      <p className="text-6xl font-bold text-gray-700 mb-4">404</p>
      <h1 className="text-2xl font-semibold mb-2">Страница не найдена</h1>
      <p className="text-gray-400 mb-8">Такой страницы не существует или она была удалена.</p>
      <Link
        href="/"
        className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
      >
        На главную
      </Link>
    </div>
  );
}
