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
      <div className="relative rounded-2xl bg-card border border-live/30 overflow-hidden mb-8">
        <div
          className="absolute inset-0 bg-gradient-to-b from-live/5 to-transparent pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative flex flex-col items-center justify-center py-10 gap-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-live">
            <span className="w-2 h-2 rounded-full bg-live animate-live-blink" />
            LIVE
          </div>
          <div className="shimmer h-10 w-40 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl bg-card border border-live/30 overflow-hidden mb-8">
      {/* Red glow overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-live/6 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative px-6 py-10">
        {/* LIVE indicator */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-live tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-live animate-live-blink" />
            Live
          </span>
        </div>

        {/* Teams + score */}
        <div className="flex items-center justify-center gap-4 sm:gap-10">
          <div className="flex-1 text-right min-w-0">
            <p className="text-xl sm:text-2xl font-bold text-prose break-words">
              {score.team1.name}
            </p>
            <p className="text-muted text-sm font-mono mt-0.5">
              [{score.team1.tag}]
            </p>
          </div>

          <div className="shrink-0 text-center">
            <p className="text-5xl sm:text-6xl font-bold tabular-nums text-prose tracking-tight">
              {score.team1Score}
              <span className="text-live mx-2">:</span>
              {score.team2Score}
            </p>
          </div>

          <div className="flex-1 text-left min-w-0">
            <p className="text-xl sm:text-2xl font-bold text-prose break-words">
              {score.team2.name}
            </p>
            <p className="text-muted text-sm font-mono mt-0.5">
              [{score.team2.tag}]
            </p>
          </div>
        </div>

        <p className="text-center text-muted text-xs mt-6">
          обновляется каждые 5 сек
        </p>
      </div>
    </div>
  );
}
