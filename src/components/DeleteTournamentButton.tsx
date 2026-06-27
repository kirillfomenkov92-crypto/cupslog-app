"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function TrashIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export default function DeleteTournamentButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (
      !window.confirm(
        `Удалить турнир «${name}»? Будут удалены все команды, игроки и матчи. Это действие необратимо.`
      )
    )
      return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/tournaments/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Ошибка при удалении турнира");
        return;
      }
      toast.success(`Турнир «${name}» удалён`);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="inline-flex items-center gap-1.5 text-xs bg-live/10 hover:bg-live/20 text-live border border-live/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
    >
      <TrashIcon />
      {deleting ? "Удаляется..." : "Удалить"}
    </button>
  );
}
