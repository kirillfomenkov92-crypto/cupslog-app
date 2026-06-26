import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LiveScore from "@/components/LiveScore";
import Standings from "@/components/Standings";

export const revalidate = 30;

export default async function TournamentPage({ params }: { params: Promise<{ id: string }> }) {
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

  const statusLabel = { LIVE: "LIVE", COMPLETED: "Завершён", UPCOMING: "Скоро" };
  const statusColor = {
    LIVE: "bg-red-900 text-red-300",
    COMPLETED: "bg-gray-800 text-gray-500",
    UPCOMING: "bg-blue-900 text-blue-300",
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold">{tournament.name}</h1>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColor[tournament.status]}`}>
          {statusLabel[tournament.status]}
        </span>
      </div>
      {tournament.description && (
        <p className="text-gray-400 mb-8">{tournament.description}</p>
      )}

      {/* Standings */}
      <Standings teams={tournament.teams} matches={tournament.matches} />

      {/* Matches */}
      <h2 className="text-xl font-semibold mb-4">Матчи</h2>
      {tournament.matches.length === 0 ? (
        <p className="text-gray-500 mb-8">Матчей пока нет.</p>
      ) : (
        <div className="grid gap-3 mb-10">
          {tournament.matches.map((match) => (
            <Link
              key={match.id}
              href={`/matches/${match.id}`}
              className="block p-4 rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 font-medium min-w-0">
                  <span className={`truncate ${match.winnerId === match.team1Id ? "text-green-400" : ""}`}>
                    {match.team1.name}
                  </span>
                  {match.status === "LIVE" ? (
                    <LiveScore matchId={match.id} />
                  ) : (
                    <span className="text-gray-400 text-sm px-2 shrink-0">
                      {match.status === "COMPLETED" ? `${match.team1Score} : ${match.team2Score}` : "vs"}
                    </span>
                  )}
                  <span className={`truncate ${match.winnerId === match.team2Id ? "text-green-400" : ""}`}>
                    {match.team2.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 shrink-0">
                  <span>{match.format}</span>
                  {match.scheduledAt && (
                    <span>{new Date(match.scheduledAt).toLocaleString("ru-RU", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full ${
                    match.status === "LIVE" ? "bg-red-900 text-red-300"
                    : match.status === "COMPLETED" ? "bg-gray-800 text-gray-500"
                    : "bg-gray-800 text-gray-400"
                  }`}>
                    {match.status === "LIVE" ? "LIVE" : match.status === "COMPLETED" ? "Завершён" : "Ожидает"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Teams */}
      <h2 className="text-xl font-semibold mb-4">Команды ({tournament.teams.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tournament.teams.map((team) => (
          <div key={team.id} className="p-4 rounded-lg bg-gray-900 border border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">{team.name}</span>
              <span className="text-gray-500 text-xs bg-gray-800 px-1.5 py-0.5 rounded">{team.tag}</span>
            </div>
            {team.players.length > 0 && (
              <div className="flex flex-col gap-1">
                {team.players.map((p) => (
                  <div key={p.id} className="text-xs text-gray-400">
                    <span className="font-medium text-gray-300">{p.nickname}</span>
                    {p.realName && <span className="text-gray-600 ml-1">({p.realName})</span>}
                  </div>
                ))}
              </div>
            )}
            {team.players.length === 0 && (
              <p className="text-gray-600 text-xs">Нет игроков</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
