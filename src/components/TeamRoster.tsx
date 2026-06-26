"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
      await fetch(`/api/teams/${teamId}/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, realName, steamId }),
      });
      setNickname(""); setRealName(""); setSteamId("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function removePlayer(playerId: string) {
    await fetch(`/api/teams/${teamId}/players`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId }),
    });
    router.refresh();
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
              <button onClick={() => removePlayer(p.id)} className="text-gray-600 hover:text-red-400 transition-colors ml-3">✕</button>
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
          <input placeholder="Ник" value={nickname} onChange={(e) => setNickname(e.target.value)} required
            className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-xs focus:outline-none w-28" />
          <input placeholder="Имя (необяз.)" value={realName} onChange={(e) => setRealName(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-xs focus:outline-none w-32" />
          <input placeholder="SteamID (необяз.)" value={steamId} onChange={(e) => setSteamId(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-xs focus:outline-none w-36 font-mono" />
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
