"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const inputBase =
  "bg-raised border rounded-lg px-3 py-1.5 text-sm text-prose placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors";

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
        className="text-xs bg-raised hover:bg-chip text-dim hover:text-prose border border-line px-3 py-1.5 rounded-lg transition-colors"
      >
        + Команда
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-start flex-wrap mt-1">
      <div className="flex flex-col gap-1">
        <input
          id={`team-name-${tournamentId}`}
          name="team-name"
          aria-label="Название команды"
          placeholder="Название…"
          autoComplete="off"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={`${inputBase} w-44 ${fieldErrors.name ? "border-live" : "border-line"}`}
        />
        {fieldErrors.name && (
          <span className="text-live text-xs">{fieldErrors.name}</span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <input
          id={`team-tag-${tournamentId}`}
          name="team-tag"
          aria-label="Тег команды (до 5 символов)"
          placeholder="TAG"
          autoComplete="off"
          spellCheck={false}
          value={tag}
          onChange={(e) => setTag(e.target.value.toUpperCase())}
          required
          maxLength={5}
          className={`${inputBase} w-20 font-mono ${fieldErrors.tag ? "border-live" : "border-line"}`}
        />
        {fieldErrors.tag && (
          <span className="text-live text-xs">{fieldErrors.tag}</span>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="text-xs bg-accent hover:bg-accent-hover text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? "..." : "Создать"}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-xs text-muted hover:text-dim px-2 py-1.5"
      >
        Отмена
      </button>
    </form>
  );
}
