import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LiveScoreBanner from "@/components/LiveScoreBanner";

export const revalidate = 30;

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = await prisma.match.findUnique({
    where: { id },
    include: { team1: true, team2: true, winner: true, maps: true },
  });

  if (!match) notFound();

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
        <span>{match.format}</span>
        <span>·</span>
        <span
          className={`px-2 py-0.5 rounded-full ${
            match.status === "LIVE"
              ? "bg-red-900 text-red-300"
              : match.status === "COMPLETED"
                ? "bg-gray-800 text-gray-500"
                : "bg-gray-800 text-gray-400"
          }`}
        >
          {match.status === "LIVE" ? "LIVE" : match.status === "COMPLETED" ? "Завершён" : "Ожидает"}
        </span>
      </div>

      {match.status === "LIVE" && <LiveScoreBanner matchId={match.id} />}

      {match.status !== "LIVE" && (
        <div className="text-center py-8 rounded-xl bg-gray-900 border border-gray-800 mb-8">
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="font-bold text-lg">{match.team1.name}</p>
              <p className="text-gray-500 text-sm">[{match.team1.tag}]</p>
            </div>
            <div className="text-4xl font-bold">
              {match.status === "COMPLETED"
                ? `${match.team1Score} : ${match.team2Score}`
                : "vs"}
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">{match.team2.name}</p>
              <p className="text-gray-500 text-sm">[{match.team2.tag}]</p>
            </div>
          </div>
          {match.winner && (
            <p className="text-green-400 text-sm mt-4">
              Победитель: <strong>{match.winner.name}</strong>
            </p>
          )}
        </div>
      )}

      {match.maps.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Карты</h2>
          <div className="grid gap-2">
            {match.maps.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-900 border border-gray-800">
                <span className="text-sm font-medium">{m.mapName}</span>
                <span className="text-sm text-gray-400">
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
