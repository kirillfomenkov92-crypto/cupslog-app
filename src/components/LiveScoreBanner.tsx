"use client";
import { useEffect, useState } from "react";

interface ScoreData {
  team1Score: number;
  team2Score: number;
  status: string;
  team1: { name: string; tag: string };
  team2: { name: string; tag: string };
}

export default function LiveScoreBanner({ matchId }: { matchId: string }) {
  const [score, setScore] = useState<ScoreData | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    async function fetchScore() {
      try {
        const res = await fetch(`/api/matches/${matchId}/score`);
        if (!res.ok) return;
        const data: ScoreData = await res.json();
        setScore(data);
        if (data.status === "COMPLETED") setCompleted(true);
      } catch {
        // silently ignore
      }
    }

    fetchScore();
    const interval = setInterval(() => {
      if (!completed) fetchScore();
      else clearInterval(interval);
    }, 5000);

    return () => clearInterval(interval);
  }, [matchId, completed]);

  if (!score) {
    return (
      <div className="text-center py-8 rounded-xl bg-gray-900 border border-red-900 mb-8 animate-pulse">
        <p className="text-red-400 font-bold">LIVE — загрузка счёта...</p>
      </div>
    );
  }

  return (
    <div className="text-center py-8 rounded-xl bg-gray-900 border border-red-900 mb-8">
      <p className="text-red-400 text-xs font-bold mb-4 tracking-widest">● LIVE</p>
      <div className="flex items-center justify-center gap-8">
        <div className="text-center">
          <p className="font-bold text-lg">{score.team1.name}</p>
          <p className="text-gray-500 text-sm">[{score.team1.tag}]</p>
        </div>
        <div className="text-5xl font-bold tabular-nums">
          {score.team1Score} : {score.team2Score}
        </div>
        <div className="text-center">
          <p className="font-bold text-lg">{score.team2.name}</p>
          <p className="text-gray-500 text-sm">[{score.team2.tag}]</p>
        </div>
      </div>
      <p className="text-gray-600 text-xs mt-4">обновляется каждые 5 сек</p>
    </div>
  );
}
