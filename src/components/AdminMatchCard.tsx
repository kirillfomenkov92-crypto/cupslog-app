"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Team {
  id: string;
  name: string;
}

interface Match {
  id: string;
  team1: Team;
  team2: Team;
  format: string;
  status: string;
  team1Score: number;
  team2Score: number;
}

function DownloadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export default function AdminMatchCard({ match }: { match: Match }) {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState(match.status);
  const [winnerId, setWinnerId] = useState("");

  async function downloadConfig() {
    setDownloading(true);
    try {
      const res = await fetch(`/api/matches/${match.id}/config`);
      if (!res.ok) throw new Error("Ошибка");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `match_${match.id}.cfg`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  async function deleteMatch() {
    if (
      !window.confirm(
        `Удалить матч «${match.team1.name} vs ${match.team2.name}»? Это действие необратимо.`
      )
    )
      return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/matches/${match.id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Ошибка при удалении матча");
        return;
      }
      toast.success("Матч удалён");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  async function updateMatch() {
    setUpdating(true);
    try {
      const res = await fetch(`/api/matches/${match.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, winnerId: winnerId || null }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Ошибка при сохранении");
      } else {
        toast.success("Сохранено");
      }
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="p-4 rounded-lg bg-raised border border-line">
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <span className="font-medium text-sm text-prose">
          {match.team1.name} vs {match.team2.name}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted font-mono">{match.format}</span>
          <span className="text-xs bg-chip px-2 py-0.5 rounded-full text-dim">
            {match.status}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={downloadConfig}
          disabled={downloading}
          className="inline-flex items-center gap-1.5 text-xs bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          <DownloadIcon />
          {downloading ? "Генерируется..." : "Скачать конфиг"}
        </button>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Статус матча"
          className="text-xs bg-raised border border-line rounded-lg px-2 py-1.5 text-prose focus:outline-none focus:border-accent transition-colors"
        >
          <option value="PENDING">PENDING</option>
          <option value="LIVE">LIVE</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        {status === "COMPLETED" && (
          <select
            value={winnerId}
            onChange={(e) => setWinnerId(e.target.value)}
            aria-label="Победитель"
            className="text-xs bg-raised border border-line rounded-lg px-2 py-1.5 text-prose focus:outline-none focus:border-accent transition-colors"
          >
            <option value="">Выбрать победителя</option>
            <option value={match.team1.id}>{match.team1.name}</option>
            <option value={match.team2.id}>{match.team2.name}</option>
          </select>
        )}

        <button
          onClick={updateMatch}
          disabled={updating}
          className="text-xs bg-win/10 hover:bg-win/20 text-win border border-win/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {updating ? "Сохраняется..." : "Сохранить"}
        </button>

        <button
          onClick={deleteMatch}
          disabled={deleting}
          className="inline-flex items-center gap-1.5 text-xs bg-live/10 hover:bg-live/20 text-live border border-live/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ml-auto"
        >
          <TrashIcon />
          {deleting ? "Удаляется..." : "Удалить"}
        </button>
      </div>
    </div>
  );
}
