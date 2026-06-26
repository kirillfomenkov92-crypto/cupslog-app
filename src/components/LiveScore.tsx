"use client";
import { useEffect, useState } from "react";

interface ScoreData {
  team1Score: number;
  team2Score: number;
  status: string;
}

export default function LiveScore({ matchId }: { matchId: string }) {
  const [score, setScore] = useState<ScoreData | null>(null);

  useEffect(() => {
    let stopped = false;

    async function fetchScore() {
      try {
        const res = await fetch(`/api/matches/${matchId}/score`);
        if (!res.ok) return;
        const data: ScoreData = await res.json();
        setScore(data);
        if (data.status === "COMPLETED") stopped = true;
      } catch {
        // silently ignore network errors
      }
    }

    fetchScore();
    const interval = setInterval(() => {
      if (!stopped) fetchScore();
      else clearInterval(interval);
    }, 5000);

    return () => clearInterval(interval);
  }, [matchId]);

  if (!score) {
    return <span className="text-red-400 text-sm px-2 animate-pulse">LIVE</span>;
  }

  return (
    <span className="text-red-400 text-sm font-bold px-2">
      {score.team1Score} : {score.team2Score}
    </span>
  );
}
