interface Team {
  id: string;
  name: string;
  tag: string;
}

interface Match {
  team1Id: string;
  team2Id: string;
  winnerId: string | null;
  status: string;
  team1Score: number;
  team2Score: number;
}

export default function Standings({
  teams,
  matches,
}: {
  teams: Team[];
  matches: Match[];
}) {
  const completedMatches = matches.filter(
    (m) => m.status === "COMPLETED" && m.winnerId
  );

  const stats = teams.map((team) => {
    const played = completedMatches.filter(
      (m) => m.team1Id === team.id || m.team2Id === team.id
    );
    const wins = played.filter((m) => m.winnerId === team.id).length;
    const losses = played.length - wins;
    let mapsWon = 0;
    let mapsLost = 0;
    for (const m of played) {
      if (m.team1Id === team.id) {
        mapsWon += m.team1Score;
        mapsLost += m.team2Score;
      } else {
        mapsWon += m.team2Score;
        mapsLost += m.team1Score;
      }
    }
    return { team, wins, losses, mapsWon, mapsLost, played: played.length };
  });

  stats.sort((a, b) => b.wins - a.wins || b.mapsWon - a.mapsWon);

  if (completedMatches.length === 0) return null;

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-prose mb-4">
        Таблица результатов
      </h2>
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-raised">
              <th className="text-left py-2.5 px-4 text-xs font-medium text-muted uppercase tracking-wider">
                #
              </th>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-muted uppercase tracking-wider">
                Команда
              </th>
              <th className="text-center py-2.5 px-3 text-xs font-medium text-muted uppercase tracking-wider">
                М
              </th>
              <th className="text-center py-2.5 px-3 text-xs font-medium text-muted uppercase tracking-wider">
                В
              </th>
              <th className="text-center py-2.5 px-3 text-xs font-medium text-muted uppercase tracking-wider">
                П
              </th>
              <th className="text-center py-2.5 px-3 text-xs font-medium text-muted uppercase tracking-wider">
                Карты
              </th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s, i) => (
              <tr
                key={s.team.id}
                className="border-b border-line last:border-none hover:bg-raised transition-colors duration-100"
              >
                <td className="py-3 px-4 text-muted font-mono text-xs">
                  {i + 1}
                </td>
                <td className="py-3 px-4 font-medium text-prose">
                  {s.team.name}
                  <span className="text-muted text-xs font-mono ml-2">
                    {s.team.tag}
                  </span>
                </td>
                <td className="text-center py-3 px-3 text-dim font-mono">
                  {s.played}
                </td>
                <td className="text-center py-3 px-3 text-win font-bold font-mono">
                  {s.wins}
                </td>
                <td className="text-center py-3 px-3 text-live font-mono">
                  {s.losses}
                </td>
                <td className="text-center py-3 px-3 text-dim font-mono">
                  {s.mapsWon}:{s.mapsLost}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
