import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function TournamentsPage() {
  const tournaments = await prisma.tournament.findMany({
    orderBy: { startDate: "desc" },
    include: { _count: { select: { teams: true, matches: true } } },
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Турниры</h1>
      {tournaments.length === 0 ? (
        <p className="text-gray-500">Турниров пока нет.</p>
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
                      : t.status === "COMPLETED"
                        ? "bg-gray-800 text-gray-500"
                        : "bg-blue-900 text-blue-300"
                  }`}
                >
                  {t.status === "LIVE" ? "LIVE" : t.status === "COMPLETED" ? "Завершён" : "Скоро"}
                </span>
              </div>
              {t.description && <p className="text-gray-400 text-sm mt-1">{t.description}</p>}
              <div className="flex gap-4 mt-2 text-gray-500 text-xs">
                <span>{t._count.teams} команд</span>
                <span>{t._count.matches} матчей</span>
                <span>{new Date(t.startDate).toLocaleDateString("ru-RU")}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
