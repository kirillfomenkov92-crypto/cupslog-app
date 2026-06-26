"use client";
import { useState } from "react";

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

export default function AdminMatchCard({ match }: { match: Match }) {
  const [downloading, setDownloading] = useState(false);
  const [updating, setUpdating] = useState(false);
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

  async function updateMatch() {
    setUpdating(true);
    try {
      await fetch(`/api/matches/${match.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, winnerId: winnerId || null }),
      });
      alert("Сохранено");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium">
          {match.team1.name} vs {match.team2.name}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{match.format}</span>
          <span className="text-xs bg-gray-800 px-2 py-0.5 rounded-full text-gray-400">
            {match.status}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <button
          onClick={downloadConfig}
          disabled={downloading}
          className="text-xs bg-blue-900 hover:bg-blue-800 text-blue-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {downloading ? "Генерируется..." : "⬇ Скачать конфиг матча"}
        </button>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="text-xs bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 focus:outline-none"
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
            className="text-xs bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 focus:outline-none"
          >
            <option value="">Выбрать победителя</option>
            <option value={match.team1.id}>{match.team1.name}</option>
            <option value={match.team2.id}>{match.team2.name}</option>
          </select>
        )}

        <button
          onClick={updateMatch}
          disabled={updating}
          className="text-xs bg-green-900 hover:bg-green-800 text-green-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {updating ? "Сохраняется..." : "Сохранить"}
        </button>
      </div>
    </div>
  );
}
