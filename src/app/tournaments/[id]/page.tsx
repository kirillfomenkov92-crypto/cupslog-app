import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LiveScore from "@/components/LiveScore";
import Standings from "@/components/Standings";
import Bracket from "@/components/Bracket";

export const revalidate = 30;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const tournament = await prisma.tournament.findUnique({ where: { id } });
  if (!tournament) return {};
  const start = new Date(tournament.startDate).toLocaleDateString("ru-RU");
  return {
    title: `${tournament.name} — CupsLog`,
    description: tournament.description ?? `CS2 турнир ${tournament.name}, начало ${start}`,
    openGraph: {
      title: tournament.name,
      description: tournament.description ?? `CS2 турнир. Начало: ${start}`,
      type: "website",
    },
  };
}

type TournamentStatus = "LIVE" | "UPCOMING" | "COMPLETED";
type MatchStatus = "LIVE" | "COMPLETED" | string;

function TournamentStatusBadge({ status }: { status: TournamentStatus }) {
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

function MatchStatusBadge({ status }: { status: MatchStatus }) {
  if (status === "LIVE") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-live/15 text-live">
        <span className="w-1.5 h-1.5 rounded-full bg-live animate-live-blink" />
        LIVE
      </span>
    );
  }
  if (status === "COMPLETED") {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-chip text-muted">
        Завершён
      </span>
    );
  }
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-chip text-dim">
      Ожидает
    </span>
  );
}

function TeamInitials({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div className="w-9 h-9 rounded-lg bg-accent/12 text-accent text-sm font-bold flex items-center justify-center shrink-0 font-mono tracking-tighter select-none">
      {initials || name[0]?.toUpperCase()}
    </div>
  );
}

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      teams: { include: { players: true } },
      matches: {
        include: { team1: true, team2: true, winner: true },
        orderBy: { scheduledAt: "asc" },
      },
    },
  });

  if (!tournament) notFound();

  return (
    <div className="animate-page-in px-6 md:px-8 py-8">
      {/* ── Tournament Header ─────────────────────────────────────── */}
      <div className="relative mb-8 pb-8 border-b border-line">
        <div
          className="absolute -top-4 -left-6 w-64 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-prose mb-2 leading-tight">
              {tournament.name}
            </h1>
            {tournament.description && (
              <p className="text-dim mb-3 text-sm">{tournament.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
              <span>{tournament.teams.length} команд</span>
              <span>{tournament.matches.length} матчей</span>
              <span>{new Date(tournament.startDate).toLocaleDateString("ru-RU")}</span>
            </div>
          </div>
          <TournamentStatusBadge status={tournament.status as TournamentStatus} />
        </div>
      </div>

      {/* ── Standings ────────────────────────────────────────────── */}
      <Standings teams={tournament.teams} matches={tournament.matches} />

      {/* ── Matches ──────────────────────────────────────────────── */}
      <h2 className="text-lg font-semibold text-prose mb-4">Матчи</h2>
      {tournament.matches.length === 0 ? (
        <p className="text-dim text-sm mb-8">
          Матчей пока нет.{" "}
          <Link href="/admin" className="text-accent hover:text-accent-hover transition-colors">
            Добавь первый матч в админ-панели.
          </Link>
        </p>
      ) : (
        <div className="grid gap-2 mb-10">
          {tournament.matches.map((match) => (
            <Link
              key={match.id}
              href={`/matches/${match.id}`}
              className="group block p-4 rounded-xl bg-card border border-line hover:border-line-strong hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                {/* Team 1 */}
                <span
                  className={`flex-1 text-right font-semibold text-sm truncate transition-colors duration-150 ${
                    match.winnerId === match.team1Id
                      ? "text-win"
                      : "text-prose group-hover:text-white"
                  }`}
                >
                  {match.team1.name}
                </span>

                {/* Score */}
                <div className="shrink-0 min-w-[76px] text-center">
                  {match.status === "LIVE" ? (
                    <LiveScore matchId={match.id} />
                  ) : (
                    <span
                      className={`text-base font-bold tabular-nums ${
                        match.status === "COMPLETED" ? "text-prose" : "text-muted"
                      }`}
                    >
                      {match.status === "COMPLETED"
                        ? `${match.team1Score} : ${match.team2Score}`
                        : "—"}
                    </span>
                  )}
                </div>

                {/* Team 2 */}
                <span
                  className={`flex-1 font-semibold text-sm truncate transition-colors duration-150 ${
                    match.winnerId === match.team2Id
                      ? "text-win"
                      : "text-prose group-hover:text-white"
                  }`}
                >
                  {match.team2.name}
                </span>

                {/* Meta */}
                <div className="hidden sm:flex items-center gap-2 text-xs text-muted shrink-0">
                  <span className="font-mono">{match.format}</span>
                  {match.scheduledAt && (
                    <span>
                      {new Date(match.scheduledAt).toLocaleString("ru-RU", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                  <MatchStatusBadge status={match.status} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ── Bracket ──────────────────────────────────────────────── */}
      <Bracket
        matches={tournament.matches.map((m) => ({
          ...m,
          scheduledAt: m.scheduledAt ? m.scheduledAt.toISOString() : null,
          createdAt: m.createdAt.toISOString(),
        }))}
      />

      {/* ── Teams ────────────────────────────────────────────────── */}
      <h2 className="text-lg font-semibold text-prose mb-4">
        Команды ({tournament.teams.length})
      </h2>
      {tournament.teams.length === 0 && (
        <p className="text-dim text-sm mb-4">
          Команд пока нет.{" "}
          <Link href="/admin" className="text-accent hover:text-accent-hover transition-colors">
            Добавь первую команду в админ-панели.
          </Link>
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tournament.teams.map((team) => (
          <div key={team.id} className="p-4 rounded-xl bg-card border border-line">
            <div className="flex items-center gap-3 mb-3">
              <TeamInitials name={team.name} />
              <div className="min-w-0">
                <p className="font-semibold text-prose truncate">{team.name}</p>
                <span className="text-muted text-xs font-mono">{team.tag}</span>
              </div>
            </div>
            {team.players.length > 0 ? (
              <div className="flex flex-col gap-1 border-l-2 border-line pl-3 ml-1">
                {team.players.map((p) => (
                  <div key={p.id} className="text-xs">
                    <span className="font-medium text-dim">{p.nickname}</span>
                    {p.realName && (
                      <span className="text-muted ml-1.5">({p.realName})</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-xs pl-1">Нет игроков</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
