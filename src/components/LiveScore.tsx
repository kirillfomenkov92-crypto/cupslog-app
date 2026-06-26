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
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-live/15 text-live">
        <span className="w-1.5 h-1.5 rounded-full bg-live animate-live-blink" />
        LIVE
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-live animate-live-blink shrink-0" />
      <span className="text-base font-bold tabular-nums text-live">
        {score.team1Score} : {score.team2Score}
      </span>
    </span>
  );
}
