"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CS2_MAPS = [
  "de_dust2",
  "de_mirage",
  "de_inferno",
  "de_nuke",
  "de_overpass",
  "de_ancient",
  "de_anubis",
  "de_vertigo",
];

const selectBase =
  "bg-raised border border-line rounded-lg px-3 py-1.5 text-sm text-prose focus:outline-none focus:border-accent transition-colors";

interface Team {
  id: string;
  name: string;
  tag: string;
}

export default function CreateMatchForm({
  tournamentId,
  teams,
}: {
  tournamentId: string;
  teams: Team[];
}) {
  const router = useRouter();
  const [team1Id, setTeam1Id] = useState("");
  const [team2Id, setTeam2Id] = useState("");
  const [format, setFormat] = useState("BO1");
  const [mapPool, setMapPool] = useState<string[]>([]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function toggleMap(map: string) {
    setMapPool((prev) =>
      prev.includes(map) ? prev.filter((m) => m !== map) : [...prev, map]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    if (team1Id === team2Id) {
      toast.error("Команды должны быть разными");
      setFieldErrors({ team2Id: "Команды должны быть разными" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team1Id,
          team2Id,
          format,
          mapPool,
          scheduledAt: scheduledAt || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.field) setFieldErrors({ [data.field]: data.error });
        toast.error(data.error ?? "Ошибка при создании матча");
        return;
      }
      setTeam1Id("");
      setTeam2Id("");
      setFormat("BO1");
      setMapPool([]);
      setScheduledAt("");
      setOpen(false);
      router.refresh();
      toast.success("Матч создан");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        disabled={teams.length < 2}
        title={teams.length < 2 ? "Сначала добавь минимум 2 команды" : ""}
        className="text-xs bg-raised hover:bg-chip text-dim hover:text-prose border border-line px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        + Матч
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-raised border border-line rounded-xl p-4 mt-2 flex flex-col gap-3"
    >
      <div className="flex gap-3 flex-wrap">
        <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
          <label className="text-xs text-dim">Команда 1</label>
          <select
            value={team1Id}
            onChange={(e) => setTeam1Id(e.target.value)}
            required
            aria-label="Команда 1"
            className={`${selectBase} w-full ${fieldErrors.team1Id ? "border-live" : ""}`}
          >
            <option value="">Выбрать…</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} [{t.tag}]
              </option>
            ))}
          </select>
          {fieldErrors.team1Id && (
            <span className="text-live text-xs">{fieldErrors.team1Id}</span>
          )}
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
          <label className="text-xs text-dim">Команда 2</label>
          <select
            value={team2Id}
            onChange={(e) => setTeam2Id(e.target.value)}
            required
            aria-label="Команда 2"
            className={`${selectBase} w-full ${fieldErrors.team2Id ? "border-live" : ""}`}
          >
            <option value="">Выбрать…</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} [{t.tag}]
              </option>
            ))}
          </select>
          {fieldErrors.team2Id && (
            <span className="text-live text-xs">{fieldErrors.team2Id}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-dim">Формат</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            aria-label="Формат матча"
            className={`${selectBase} w-24`}
          >
            <option>BO1</option>
            <option>BO3</option>
            <option>BO5</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-dim">Время</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            aria-label="Время начала матча"
            className={`${selectBase}`}
          />
        </div>
      </div>

      <div>
        <p className="text-xs text-dim mb-2">Map pool (для veto):</p>
        <div className="flex flex-wrap gap-1.5">
          {CS2_MAPS.map((map) => (
            <button
              key={map}
              type="button"
              onClick={() => toggleMap(map)}
              className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
                mapPool.includes(map)
                  ? "bg-accent/15 border-accent/30 text-accent"
                  : "bg-chip border-line text-muted hover:border-line-strong hover:text-dim"
              }`}
            >
              {map}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="text-xs bg-accent hover:bg-accent-hover text-white px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Создаётся..." : "Создать матч"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-muted hover:text-dim px-2"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
