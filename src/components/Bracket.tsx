"use client";
import { useState } from "react";
import Link from "next/link";

interface Team {
  id: string;
  name: string;
}

interface BracketMatch {
  id: string;
  team1: Team;
  team2: Team;
  team1Score: number;
  team2Score: number;
  status: string;
  winnerId: string | null;
  scheduledAt: string | null;
  createdAt: string;
}

function groupIntoRounds(matches: BracketMatch[]): BracketMatch[][] {
  if (matches.length === 0) return [];

  const buckets = new Map<string, BracketMatch[]>();
  for (const m of matches) {
    const key = m.scheduledAt
      ? new Date(m.scheduledAt).toISOString().slice(0, 10)
      : `created_${new Date(m.createdAt).toISOString().slice(0, 16)}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(m);
  }

  const sortedKeys = [...buckets.keys()].sort();
  return sortedKeys.map((k) => buckets.get(k)!);
}

const ROUND_LABELS: Record<number, string> = {
  1: "Финал",
  2: "Полуфинал",
  4: "Четвертьфинал",
  8: "1/8 финала",
  16: "1/16 финала",
};

function roundLabel(totalRounds: number, roundIndex: number): string {
  const matchesInRound = Math.pow(2, totalRounds - 1 - roundIndex);
  return ROUND_LABELS[matchesInRound] ?? `Раунд ${roundIndex + 1}`;
}

export default function Bracket({ matches }: { matches: BracketMatch[] }) {
  const [open, setOpen] = useState(false);

  const completed = matches.filter((m) => m.status === "COMPLETED");
  if (matches.length < 2 || completed.length === 0) return null;

  const rounds = groupIntoRounds(matches);
  const totalRounds = rounds.length;

  return (
    <div className="mb-10">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm font-semibold text-dim hover:text-prose transition-colors duration-150 mb-3"
        aria-expanded={open}
      >
        <span
          className={`text-accent transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          aria-hidden="true"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <path d="M3 1l5 4-5 4V1z" />
          </svg>
        </span>
        Сетка турнира
      </button>

      {open && (
        <div className="overflow-x-auto pb-3 rounded-xl border border-line">
          <div className="flex gap-0 min-w-max">
            {rounds.map((roundMatches, rIdx) => (
              <div
                key={rIdx}
                className={`flex flex-col gap-4 min-w-[200px] p-4 ${
                  rIdx < rounds.length - 1 ? "border-r border-line" : ""
                }`}
              >
                <p className="text-xs font-semibold text-muted uppercase tracking-wider text-center">
                  {roundLabel(totalRounds, rIdx)}
                </p>
                <div className="flex flex-col gap-2.5 justify-around h-full">
                  {roundMatches.map((m) => (
                    <Link
                      key={m.id}
                      href={`/matches/${m.id}`}
                      className="block rounded-lg border border-line bg-raised hover:border-line-strong transition-colors duration-150 overflow-hidden text-sm"
                    >
                      <div
                        className={`flex items-center justify-between px-3 py-2 border-b border-line ${
                          m.winnerId === m.team1.id
                            ? "text-win"
                            : "text-dim"
                        }`}
                      >
                        <span className="font-medium truncate">
                          {m.team1.name}
                        </span>
                        {m.status === "COMPLETED" && (
                          <span className="ml-2 font-bold font-mono shrink-0">
                            {m.team1Score}
                          </span>
                        )}
                      </div>
                      <div
                        className={`flex items-center justify-between px-3 py-2 ${
                          m.winnerId === m.team2.id
                            ? "text-win"
                            : "text-dim"
                        }`}
                      >
                        <span className="font-medium truncate">
                          {m.team2.name}
                        </span>
                        {m.status === "COMPLETED" && (
                          <span className="ml-2 font-bold font-mono shrink-0">
                            {m.team2Score}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
