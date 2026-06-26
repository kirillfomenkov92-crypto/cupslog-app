"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateTeamForm({ tournamentId }: { tournamentId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setLoading(true);
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, tag }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.field) setFieldErrors({ [data.field]: data.error });
        toast.error(data.error ?? "Ошибка при создании команды");
        return;
      }
      setName("");
      setTag("");
      setOpen(false);
      router.refresh();
      toast.success("Команда добавлена");
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
    <form onSubmit={handleSubmit} className="flex gap-2 items-start flex-wrap mt-2">
      <div className="flex flex-col gap-1">
        <input
          name="team-name"
          aria-label="Название команды"
          placeholder="Название команды…"
          autoComplete="off"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={`bg-gray-800 border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:border-gray-500 w-44 ${fieldErrors.name ? "border-red-500" : "border-gray-700"}`}
        />
        {fieldErrors.name && <span className="text-red-400 text-xs">{fieldErrors.name}</span>}
      </div>
      <div className="flex flex-col gap-1">
        <input
          name="team-tag"
          aria-label="Тег команды (до 5 символов)"
          placeholder="TAG…"
          autoComplete="off"
          spellCheck={false}
          value={tag}
          onChange={(e) => setTag(e.target.value.toUpperCase())}
          required
          maxLength={5}
          className={`bg-gray-800 border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:border-gray-500 w-20 ${fieldErrors.tag ? "border-red-500" : "border-gray-700"}`}
        />
        {fieldErrors.tag && <span className="text-red-400 text-xs">{fieldErrors.tag}</span>}
      </div>
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
