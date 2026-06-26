"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTeamForm({ tournamentId }: { tournamentId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, tag }),
      });
      if (!res.ok) throw new Error();
      setName("");
      setTag("");
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
        className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
      >
        + Добавить команду
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center flex-wrap mt-2">
      <input
        placeholder="Название команды"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-gray-500 w-44"
      />
      <input
        placeholder="TAG"
        value={tag}
        onChange={(e) => setTag(e.target.value.toUpperCase())}
        required
        maxLength={5}
        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-gray-500 w-20"
      />
      <button
        type="submit"
        disabled={loading}
        className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? "..." : "Создать"}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-xs text-gray-500 hover:text-gray-300 px-2"
      >
        Отмена
      </button>
    </form>
  );
}
