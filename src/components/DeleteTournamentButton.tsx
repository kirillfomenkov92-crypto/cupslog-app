"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeleteTournamentButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Удалить турнир «${name}»? Будут удалены все команды, игроки и матчи. Это действие необратимо.`)) return;
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
      className="text-xs bg-red-900 hover:bg-red-800 text-red-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
    >
      {deleting ? "Удаляется..." : "Удалить турнир"}
    </button>
  );
}
