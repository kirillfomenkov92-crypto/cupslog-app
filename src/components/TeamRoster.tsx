"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function XIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const inputBase =
  "bg-canvas border border-line rounded-lg px-2 py-1 text-xs text-prose placeholder:text-muted focus:outline-none focus:border-accent transition-colors";

interface Player {
  id: string;
  nickname: string;
  realName: string | null;
  steamId: string | null;
}

export default function TeamRoster({
  teamId,
  players,
}: {
  teamId: string;
  players: Player[];
}) {
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
      setNickname("");
      setRealName("");
      setSteamId("");
      setOpen(false);
      router.refresh();
      toast.success("Игрок добавлен");
    } finally {
      setLoading(false);
    }
  }

  async function removePlayer(playerId: string, playerName: string) {
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
    toast.success(`${playerName} удалён`);
  }

  return (
    <div className="mt-1">
      {players.length > 0 && (
        <div className="flex flex-col gap-1 mb-2">
          {players.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between text-xs bg-canvas border border-line px-3 py-1.5 rounded-lg"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium text-prose truncate">{p.nickname}</span>
                {p.realName && (
                  <span className="text-muted shrink-0">{p.realName}</span>
                )}
                {p.steamId && (
                  <span className="text-muted font-mono shrink-0">{p.steamId}</span>
                )}
              </div>
              <button
                onClick={() => removePlayer(p.id, p.nickname)}
                aria-label={`Удалить игрока ${p.nickname}`}
                className="text-muted hover:text-live transition-colors ml-2 p-0.5 rounded shrink-0"
              >
                <XIcon />
              </button>
            </div>
          ))}
        </div>
      )}

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-xs text-muted hover:text-dim transition-colors"
        >
          + Игрок
        </button>
      ) : (
        <form
          onSubmit={addPlayer}
          className="flex gap-2 flex-wrap items-center mt-1"
        >
          <input
            placeholder="Ник"
            aria-label="Никнейм игрока"
            autoComplete="off"
            spellCheck={false}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            className={`${inputBase} w-28`}
          />
          <input
            placeholder="Имя"
            aria-label="Настоящее имя (необязательно)"
            autoComplete="off"
            value={realName}
            onChange={(e) => setRealName(e.target.value)}
            className={`${inputBase} w-32`}
          />
          <input
            placeholder="SteamID"
            aria-label="Steam ID (необязательно)"
            autoComplete="off"
            spellCheck={false}
            value={steamId}
            onChange={(e) => setSteamId(e.target.value)}
            className={`${inputBase} w-36 font-mono`}
          />
          <button
            type="submit"
            disabled={loading}
            className="text-xs bg-raised hover:bg-chip text-dim px-3 py-1 rounded-lg border border-line transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Добавить"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs text-muted hover:text-dim"
          >
            Отмена
          </button>
        </form>
      )}
    </div>
  );
}
