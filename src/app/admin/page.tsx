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

  const insecureSecret =
    process.env.NEXTAUTH_SECRET === "change-this-to-a-random-secret-in-production";
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
    <div className="animate-page-in px-6 md:px-8 py-8">
      <h1 className="text-2xl font-bold tracking-tight text-prose mb-8">
        Администрация
      </h1>

      {/* Create tournament */}
      <section className="mb-10 pb-10 border-b border-line">
        <h2 className="text-base font-semibold text-prose mb-4">Создать турнир</h2>
        <CreateTournamentForm />
      </section>

      {/* Change password */}
      <section className="mb-10 pb-10 border-b border-line">
        <ChangePasswordForm insecureSecret={insecureSecret} />
      </section>

      {/* Tournaments list */}
      <section>
        <h2 className="text-base font-semibold text-prose mb-6">
          Турниры ({tournaments.length})
        </h2>
        {tournaments.length === 0 && (
          <p className="text-dim text-sm">Нет турниров. Создай первый выше.</p>
        )}
        <div className="flex flex-col gap-6">
          {tournaments.map((t) => (
            <div
              key={t.id}
              className="bg-card border border-line rounded-xl p-6"
            >
              {/* Tournament header */}
              <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-prose leading-tight">{t.name}</h3>
                  <p className="text-muted text-xs mt-1">
                    {new Date(t.startDate).toLocaleDateString("ru-RU")}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <TournamentStatusControl id={t.id} status={t.status} />
                  <DeleteTournamentButton id={t.id} name={t.name} />
                </div>
              </div>

              {/* Teams */}
              <div className="mb-5">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-sm font-medium text-dim">
                    Команды ({t.teams.length})
                  </h4>
                  <CreateTeamForm tournamentId={t.id} />
                </div>
                {t.teams.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {t.teams.map((team) => (
                      <div
                        key={team.id}
                        className="bg-raised border border-line rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-sm text-prose">
                            {team.name}
                          </span>
                          <span className="text-xs text-muted bg-chip px-1.5 py-0.5 rounded font-mono">
                            {team.tag}
                          </span>
                          <span className="text-xs text-muted">
                            {team.players.length} игр.
                          </span>
                        </div>
                        <TeamRoster teamId={team.id} players={team.players} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Matches */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-sm font-medium text-dim">
                    Матчи ({t.matches.length})
                  </h4>
                  <CreateMatchForm tournamentId={t.id} teams={t.teams} />
                </div>
                {t.matches.length === 0 ? (
                  <p className="text-muted text-xs">Нет матчей</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {t.matches.map((match) => (
                      <AdminMatchCard key={match.id} match={match} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
