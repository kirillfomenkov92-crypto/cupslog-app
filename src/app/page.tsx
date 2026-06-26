import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function HomePage() {
  const tournaments = await prisma.tournament.findMany({
    where: { status: { in: ["LIVE", "UPCOMING"] } },
    orderBy: { startDate: "asc" },
    take: 5,
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-2">CupsLog</h1>
      <p className="text-gray-400 mb-10">CS2 LAN турниры с живыми счётами</p>

      <h2 className="text-xl font-semibold mb-4 text-gray-200">Активные турниры</h2>
      {tournaments.length === 0 ? (
        <p className="text-gray-500">Пока нет активных турниров.</p>
      ) : (
        <div className="grid gap-4">
          {tournaments.map((t) => (
            <Link
              key={t.id}
              href={`/tournaments/${t.id}`}
              className="block p-5 rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg">{t.name}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    t.status === "LIVE"
                      ? "bg-red-900 text-red-300"
                      : "bg-gray-800 text-gray-400"
                  }`}
                >
                  {t.status === "LIVE" ? "LIVE" : "Скоро"}
                </span>
              </div>
              {t.description && (
                <p className="text-gray-400 text-sm mt-1">{t.description}</p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                {new Date(t.startDate).toLocaleDateString("ru-RU")}
              </p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6">
        <Link href="/tournaments" className="text-blue-400 hover:text-blue-300 text-sm">
          Все турниры →
        </Link>
      </div>
    </div>
  );
}
