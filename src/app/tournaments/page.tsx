import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

type TournamentStatus = "LIVE" | "UPCOMING" | "COMPLETED";

function StatusBadge({ status }: { status: TournamentStatus }) {
  if (status === "LIVE") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-live/15 text-live shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-live animate-live-blink" />
        LIVE
      </span>
    );
  }
  if (status === "UPCOMING") {
    return (
      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent shrink-0">
        Скоро
      </span>
    );
  }
  return (
    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-chip text-muted shrink-0">
      Завершён
    </span>
  );
}

function EmptyState() {
  return (
    <div className="py-20 flex flex-col items-center gap-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-chip flex items-center justify-center">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-dim" aria-hidden="true">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M4 22h16M12 17v5M8 13v4M16 13v4M6 9h12v4a6 6 0 0 1-12 0V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-prose mb-1">Турниров пока нет</p>
        <p className="text-dim text-sm">Создайте первый в админ-панели</p>
      </div>
      <Link href="/admin" className="text-sm text-accent hover:text-accent-hover transition-colors mt-1">
        Открыть админку →
      </Link>
    </div>
  );
}

export default async function TournamentsPage() {
  const tournaments = await prisma.tournament.findMany({
    orderBy: { startDate: "desc" },
    include: { _count: { select: { teams: true, matches: true } } },
  });

  return (
    <div className="animate-page-in px-6 md:px-8 py-8">
      <h1 className="text-2xl font-bold tracking-tight text-prose mb-6">
        Турниры
      </h1>

      {tournaments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {tournaments.map((t) => (
            <Link
              key={t.id}
              href={`/tournaments/${t.id}`}
              className="group block p-5 rounded-xl bg-card border border-line hover:border-line-strong hover:-translate-y-0.5 hover:bg-raised transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-semibold text-prose group-hover:text-white transition-colors duration-150 leading-snug">
                  {t.name}
                </span>
                <StatusBadge status={t.status as TournamentStatus} />
              </div>
              {t.description && (
                <p className="text-dim text-sm mt-1.5 line-clamp-1">
                  {t.description}
                </p>
              )}
              <div className="flex gap-4 mt-2 text-muted text-xs">
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
