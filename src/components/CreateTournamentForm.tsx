"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateTournamentForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, startDate }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.field) setFieldErrors({ [data.field]: data.error });
        toast.error(data.error ?? "Ошибка при создании турнира");
        return;
      }
      setName("");
      setDescription("");
      setStartDate("");
      router.refresh();
      toast.success("Турнир создан");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-3 max-w-md"
    >
      <div className="flex flex-col gap-1">
        <input
          name="tournament-name"
          aria-label="Название турнира"
          placeholder="Название турнира…"
          autoComplete="off"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={`bg-gray-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:border-gray-500 ${fieldErrors.name ? "border-red-500" : "border-gray-700"}`}
        />
        {fieldErrors.name && <span className="text-red-400 text-xs">{fieldErrors.name}</span>}
      </div>
      <input
        name="tournament-description"
        aria-label="Описание турнира"
        placeholder="Описание (необязательно)…"
        autoComplete="off"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:border-gray-500"
      />
      <div className="flex flex-col gap-1">
        <input
          type="date"
          name="tournament-start-date"
          aria-label="Дата начала турнира"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className={`bg-gray-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:border-gray-500 ${fieldErrors.startDate ? "border-red-500" : "border-gray-700"}`}
        />
        {fieldErrors.startDate && <span className="text-red-400 text-xs">{fieldErrors.startDate}</span>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
      >
        {loading ? "Создаётся..." : "Создать турнир"}
      </button>
    </form>
  );
}
