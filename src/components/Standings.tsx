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

export default function Standings({ teams, matches }: { teams: Team[]; matches: Match[] }) {
  const completedMatches = matches.filter((m) => m.status === "COMPLETED" && m.winnerId);

  const stats = teams.map((team) => {
    const played = completedMatches.filter(
      (m) => m.team1Id === team.id || m.team2Id === team.id
    );
    const wins = played.filter((m) => m.winnerId === team.id).length;
    const losses = played.length - wins;
    let mapsWon = 0;
    let mapsLost = 0;
    for (const m of played) {
      if (m.team1Id === team.id) { mapsWon += m.team1Score; mapsLost += m.team2Score; }
      else { mapsWon += m.team2Score; mapsLost += m.team1Score; }
    }
    return { team, wins, losses, mapsWon, mapsLost, played: played.length };
  });

  stats.sort((a, b) => b.wins - a.wins || b.mapsWon - a.mapsWon);

  if (completedMatches.length === 0) return null;

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4">Таблица результатов</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs border-b border-gray-800">
              <th className="text-left py-2 pr-4">#</th>
              <th className="text-left py-2 pr-4">Команда</th>
              <th className="text-center py-2 px-3">М</th>
              <th className="text-center py-2 px-3">В</th>
              <th className="text-center py-2 px-3">П</th>
              <th className="text-center py-2 px-3">Карты</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s, i) => (
              <tr key={s.team.id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                <td className="py-2.5 pr-4 text-gray-500">{i + 1}</td>
                <td className="py-2.5 pr-4 font-medium">
                  {s.team.name}
                  <span className="text-gray-500 text-xs ml-2">[{s.team.tag}]</span>
                </td>
                <td className="text-center py-2.5 px-3 text-gray-400">{s.played}</td>
                <td className="text-center py-2.5 px-3 text-green-400 font-medium">{s.wins}</td>
                <td className="text-center py-2.5 px-3 text-red-400">{s.losses}</td>
                <td className="text-center py-2.5 px-3 text-gray-400">{s.mapsWon}:{s.mapsLost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
