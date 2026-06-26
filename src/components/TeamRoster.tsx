"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Player { id: string; nickname: string; realName: string | null; steamId: string | null }

export default function TeamRoster({ teamId, players }: { teamId: string; players: Player[] }) {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [realName, setRealName] = useState("");
  const [steamId, setSteamId] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function addPlayer(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/teams/${teamId}/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, realName, steamId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Ошибка при добавлении игрока");
        return;
      }
      setNickname(""); setRealName(""); setSteamId("");
      setOpen(false);
      router.refresh();
      toast.success("Игрок добавлен");
    } finally {
      setLoading(false);
    }
  }

  async function removePlayer(playerId: string) {
    const res = await fetch(`/api/teams/${teamId}/players`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId }),
    });
    if (!res.ok) {
      toast.error("Ошибка при удалении игрока");
      return;
    }
    router.refresh();
    toast.success("Игрок удалён");
  }

  return (
    <div className="mt-2">
      {players.length > 0 && (
        <div className="flex flex-col gap-1 mb-2">
          {players.map((p) => (
            <div key={p.id} className="flex items-center justify-between text-xs bg-gray-800 px-3 py-1.5 rounded-lg">
              <div>
                <span className="font-medium text-gray-200">{p.nickname}</span>
                {p.realName && <span className="text-gray-500 ml-2">{p.realName}</span>}
                {p.steamId && <span className="text-gray-600 ml-2 font-mono">{p.steamId}</span>}
              </div>
              <button onClick={() => removePlayer(p.id)} aria-label={`Удалить игрока ${p.nickname}`} className="text-gray-600 hover:text-red-400 transition-colors ml-3 focus-visible:ring-2 focus-visible:ring-red-500 rounded">✕</button>
            </div>
          ))}
        </div>
      )}

      {!open ? (
        <button onClick={() => setOpen(true)} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
          + Игрок
        </button>
      ) : (
        <form onSubmit={addPlayer} className="flex gap-2 flex-wrap items-center">
          <input placeholder="Ник…" aria-label="Никнейм игрока" autoComplete="off" spellCheck={false}
            value={nickname} onChange={(e) => setNickname(e.target.value)} required
            className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 w-28" />
          <input placeholder="Имя (необяз.)…" aria-label="Настоящее имя (необязательно)" autoComplete="off"
            value={realName} onChange={(e) => setRealName(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 w-32" />
          <input placeholder="SteamID (необяз.)…" aria-label="Steam ID (необязательно)" autoComplete="off" spellCheck={false}
            value={steamId} onChange={(e) => setSteamId(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 w-36 font-mono" />
          <button type="submit" disabled={loading}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1 rounded-lg transition-colors disabled:opacity-50">
            {loading ? "..." : "Добавить"}
          </button>
          <button type="button" onClick={() => setOpen(false)} className="text-xs text-gray-600 hover:text-gray-400">Отмена</button>
        </form>
      )}
    </div>
  );
}
