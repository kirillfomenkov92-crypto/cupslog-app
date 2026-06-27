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
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent shrink-0">
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
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <path d="M14 17.5h7M17.5 14v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-prose mb-1">Нет активных турниров</p>
        <p className="text-dim text-sm">Скоро появятся новые</p>
      </div>
      <Link href="/tournaments" className="text-sm text-accent hover:text-accent-hover transition-colors mt-1">
        Все турниры →
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const tournaments = await prisma.tournament.findMany({
    where: { status: { in: ["LIVE", "UPCOMING"] } },
    orderBy: { startDate: "asc" },
    take: 6,
  });

  return (
    <div className="animate-page-in px-6 md:px-8 py-8">
      {/* Hero */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          CS2 LAN Platform
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-prose mb-1.5">
          Активные турниры
        </h1>
        <p className="text-dim text-sm">
          CS2 LAN турниры с живыми счётами и MatchZy интеграцией
        </p>
      </div>

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
              <p className="text-muted text-xs mt-2">
                {new Date(t.startDate).toLocaleDateString("ru-RU")}
              </p>
            </Link>
          ))}
        </div>
      )}

      {tournaments.length > 0 && (
        <div className="mt-6">
          <Link href="/tournaments" className="text-sm text-accent hover:text-accent-hover transition-colors duration-150">
            Все турниры →
          </Link>
        </div>
      )}
    </div>
  );
}
