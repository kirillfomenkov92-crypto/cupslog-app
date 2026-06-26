import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminMatchCard from "@/components/AdminMatchCard";
import CreateTournamentForm from "@/components/CreateTournamentForm";
import CreateTeamForm from "@/components/CreateTeamForm";
import CreateMatchForm from "@/components/CreateMatchForm";
import TeamRoster from "@/components/TeamRoster";
import TournamentStatusControl from "@/components/TournamentStatusControl";
import DeleteTournamentButton from "@/components/DeleteTournamentButton";
import ChangePasswordForm from "@/components/ChangePasswordForm";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== "ADMIN") redirect("/login");

  const insecureSecret = process.env.NEXTAUTH_SECRET === "change-this-to-a-random-secret-in-production";
  const tournaments = await prisma.tournament.findMany({
    orderBy: { startDate: "desc" },
    include: {
      teams: { include: { players: true } },
      matches: {
        include: { team1: true, team2: true },
        orderBy: { scheduledAt: "asc" },
      },
    },
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Администрация</h1>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Создать турнир</h2>
        <CreateTournamentForm />
      </section>

      <section className="mb-12">
        <ChangePasswordForm insecureSecret={insecureSecret} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6">Турниры</h2>
        {tournaments.length === 0 && (
          <p className="text-gray-500">Нет турниров. Создай первый выше.</p>
        )}
        {tournaments.map((t) => (
          <div key={t.id} className="mb-10 bg-gray-900 border border-gray-800 rounded-xl p-6">
            {/* Tournament header */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-semibold">{t.name}</h3>
                <p className="text-gray-500 text-xs mt-0.5">
                  {new Date(t.startDate).toLocaleDateString("ru-RU")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <TournamentStatusControl id={t.id} status={t.status} />
                <DeleteTournamentButton id={t.id} name={t.name} />
              </div>
            </div>

            {/* Teams section */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <h4 className="text-sm font-medium text-gray-300">Команды ({t.teams.length})</h4>
                <CreateTeamForm tournamentId={t.id} />
              </div>
              {t.teams.length > 0 && (
                <div className="grid gap-3">
                  {t.teams.map((team) => (
                    <div key={team.id} className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm">{team.name}</span>
                        <span className="text-xs text-gray-500 bg-gray-700 px-1.5 py-0.5 rounded">{team.tag}</span>
                        <span className="text-xs text-gray-600">{team.players.length} игроков</span>
                      </div>
                      <TeamRoster teamId={team.id} players={team.players} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Matches section */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h4 className="text-sm font-medium text-gray-300">Матчи ({t.matches.length})</h4>
                <CreateMatchForm tournamentId={t.id} teams={t.teams} />
              </div>
              {t.matches.length === 0 ? (
                <p className="text-gray-600 text-xs">Нет матчей</p>
              ) : (
                <div className="grid gap-3">
                  {t.matches.map((match) => (
                    <AdminMatchCard key={match.id} match={match} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
