"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const inputBase =
  "bg-raised border rounded-lg px-3 py-2 text-sm text-prose placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors";

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
      className="bg-card border border-line rounded-xl p-5 flex flex-col gap-3 max-w-md"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="t-name" className="text-xs font-medium text-dim">
          Название
        </label>
        <input
          id="t-name"
          name="tournament-name"
          placeholder="CupsLog Open 2025"
          autoComplete="off"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={`${inputBase} ${fieldErrors.name ? "border-live" : "border-line"}`}
        />
        {fieldErrors.name && (
          <span className="text-live text-xs">{fieldErrors.name}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="t-desc" className="text-xs font-medium text-dim">
          Описание{" "}
          <span className="text-muted font-normal">(необязательно)</span>
        </label>
        <input
          id="t-desc"
          name="tournament-description"
          placeholder="Краткое описание турнира…"
          autoComplete="off"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputBase} border-line`}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="t-date" className="text-xs font-medium text-dim">
          Дата начала
        </label>
        <input
          id="t-date"
          type="date"
          name="tournament-start-date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className={`${inputBase} ${fieldErrors.startDate ? "border-live" : "border-line"}`}
        />
        {fieldErrors.startDate && (
          <span className="text-live text-xs">{fieldErrors.startDate}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-accent hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors mt-1 active:scale-[0.98]"
      >
        {loading ? "Создаётся..." : "Создать турнир"}
      </button>
    </form>
  );
}
