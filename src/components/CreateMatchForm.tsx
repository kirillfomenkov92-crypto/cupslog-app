"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CS2_MAPS = ["de_dust2", "de_mirage", "de_inferno", "de_nuke", "de_overpass", "de_ancient", "de_anubis", "de_vertigo"];

interface Team { id: string; name: string; tag: string }

export default function CreateMatchForm({ tournamentId, teams }: { tournamentId: string; teams: Team[] }) {
  const router = useRouter();
  const [team1Id, setTeam1Id] = useState("");
  const [team2Id, setTeam2Id] = useState("");
  const [format, setFormat] = useState("BO1");
  const [mapPool, setMapPool] = useState<string[]>([]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  function toggleMap(map: string) {
    setMapPool((prev) => prev.includes(map) ? prev.filter((m) => m !== map) : [...prev, map]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (team1Id === team2Id) { alert("Команды должны быть разными"); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team1Id, team2Id, format, mapPool, scheduledAt: scheduledAt || null }),
      });
      if (!res.ok) throw new Error();
      setTeam1Id(""); setTeam2Id(""); setFormat("BO1"); setMapPool([]); setScheduledAt("");
      setOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        disabled={teams.length < 2}
        className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        title={teams.length < 2 ? "Сначала добавь минимум 2 команды" : ""}
      >
        + Создать матч
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-xl p-4 mt-3 flex flex-col gap-3">
      <div className="flex gap-3 flex-wrap">
        <select value={team1Id} onChange={(e) => setTeam1Id(e.target.value)} required
          className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none flex-1 min-w-[140px]">
          <option value="">Команда 1</option>
          {teams.map((t) => <option key={t.id} value={t.id}>{t.name} [{t.tag}]</option>)}
        </select>
        <select value={team2Id} onChange={(e) => setTeam2Id(e.target.value)} required
          className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none flex-1 min-w-[140px]">
          <option value="">Команда 2</option>
          {teams.map((t) => <option key={t.id} value={t.id}>{t.name} [{t.tag}]</option>)}
        </select>
        <select value={format} onChange={(e) => setFormat(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none w-24">
          <option>BO1</option>
          <option>BO3</option>
          <option>BO5</option>
        </select>
        <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none" />
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-2">Map pool (для veto):</p>
        <div className="flex flex-wrap gap-2">
          {CS2_MAPS.map((map) => (
            <button key={map} type="button" onClick={() => toggleMap(map)}
              className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
                mapPool.includes(map)
                  ? "bg-blue-900 border-blue-700 text-blue-200"
                  : "bg-gray-700 border-gray-600 text-gray-400 hover:border-gray-500"
              }`}>
              {map}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={loading}
          className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50">
          {loading ? "Создаётся..." : "Создать матч"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-gray-500 hover:text-gray-300 px-2">
          Отмена
        </button>
      </div>
    </form>
  );
}
