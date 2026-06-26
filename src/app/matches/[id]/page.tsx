import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LiveScoreBanner from "@/components/LiveScoreBanner";

export const revalidate = 30;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const match = await prisma.match.findUnique({
    where: { id },
    include: { team1: true, team2: true },
  });
  if (!match) return {};
  const title = `${match.team1.name} vs ${match.team2.name} — ${match.format}`;
  const description = `Матч ${match.format}: ${match.team1.name} против ${match.team2.name} на CupsLog`;
  return {
    title: `${title} — CupsLog`,
    description,
    openGraph: { title, description, type: "website" },
  };
}

type MatchStatus = "LIVE" | "COMPLETED" | string;

function MatchStatusBadge({ status }: { status: MatchStatus }) {
  if (status === "LIVE") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-live/15 text-live">
        <span className="w-1.5 h-1.5 rounded-full bg-live animate-live-blink" />
        LIVE
      </span>
    );
  }
  if (status === "COMPLETED") {
    return (
      <span className="text-xs px-2.5 py-1 rounded-full bg-chip text-muted">
        Завершён
      </span>
    );
  }
  return (
    <span className="text-xs px-2.5 py-1 rounded-full bg-chip text-dim">
      Ожидает
    </span>
  );
}

export default async function MatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const match = await prisma.match.findUnique({
    where: { id },
    include: { team1: true, team2: true, winner: true, maps: true },
  });

  if (!match) notFound();

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Status + format */}
      <div className="flex items-center gap-3 mb-6 text-sm">
        <span className="text-muted font-mono">{match.format}</span>
        <span className="text-line-strong">·</span>
        <MatchStatusBadge status={match.status} />
      </div>

      {/* ── Hero score block ──────────────────────────────────── */}
      {match.status === "LIVE" ? (
        <LiveScoreBanner matchId={match.id} />
      ) : (
        <div className="relative rounded-2xl bg-card border border-line overflow-hidden mb-8">
          {/* Accent gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-accent/6 to-transparent pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative px-6 py-10">
            <div className="flex items-center justify-center gap-4 sm:gap-10">
              {/* Team 1 */}
              <div className="flex-1 text-right min-w-0">
                <p
                  className={`text-xl sm:text-2xl font-bold leading-tight break-words ${
                    match.winner?.id === match.team1Id ? "text-win" : "text-prose"
                  }`}
                >
                  {match.team1.name}
                </p>
                <p className="text-muted text-sm font-mono mt-0.5">
                  [{match.team1.tag}]
                </p>
              </div>

              {/* Score */}
              <div className="shrink-0 text-center">
                {match.status === "COMPLETED" ? (
                  <p className="text-5xl sm:text-6xl font-bold tabular-nums text-prose tracking-tight">
                    {match.team1Score}
                    <span className="text-muted mx-2">:</span>
                    {match.team2Score}
                  </p>
                ) : (
                  <p className="text-3xl font-bold text-muted">—</p>
                )}
              </div>

              {/* Team 2 */}
              <div className="flex-1 text-left min-w-0">
                <p
                  className={`text-xl sm:text-2xl font-bold leading-tight break-words ${
                    match.winner?.id === match.team2Id ? "text-win" : "text-prose"
                  }`}
                >
                  {match.team2.name}
                </p>
                <p className="text-muted text-sm font-mono mt-0.5">
                  [{match.team2.tag}]
                </p>
              </div>
            </div>

            {match.winner && (
              <p className="text-center text-win text-sm mt-6 font-medium">
                Победитель: <strong>{match.winner.name}</strong>
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Maps ─────────────────────────────────────────────── */}
      {match.maps.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-prose mb-3">Карты</h2>
          <div className="grid gap-2">
            {match.maps.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-card border border-line"
              >
                <span className="text-sm font-medium text-prose">
                  {m.mapName}
                </span>
                <span className="text-sm font-bold tabular-nums text-dim">
                  {m.team1Score} : {m.team2Score}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
