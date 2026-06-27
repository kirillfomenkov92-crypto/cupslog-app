"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const OPTION_STYLES: Record<string, string> = {
  UPCOMING: "bg-accent/15 text-accent border-accent/25",
  LIVE:     "bg-live/15 text-live border-live/25",
  COMPLETED: "bg-chip text-muted border-line",
};

const OPTION_LABELS: Record<string, string> = {
  UPCOMING: "Скоро",
  LIVE: "LIVE",
  COMPLETED: "Завершён",
};

export default function TournamentStatusControl({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [loading, setLoading] = useState(false);

  async function update(newStatus: string) {
    setLoading(true);
    try {
      await fetch(`/api/tournaments/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setCurrent(newStatus);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-1" role="group" aria-label="Статус турнира">
      {(["UPCOMING", "LIVE", "COMPLETED"] as const).map((opt) => (
        <button
          key={opt}
          onClick={() => update(opt)}
          disabled={loading || current === opt}
          aria-pressed={current === opt}
          className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${
            current === opt
              ? OPTION_STYLES[opt]
              : "bg-canvas text-muted border-line hover:border-line-strong hover:text-dim"
          } disabled:cursor-not-allowed`}
        >
          {OPTION_LABELS[opt]}
        </button>
      ))}
    </div>
  );
}
