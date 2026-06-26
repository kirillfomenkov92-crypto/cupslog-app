"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TournamentStatusControl({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [loading, setLoading] = useState(false);

  async function update(newStatus: string) {
    setLoading(true);
    try {
      await fetch(`/api/tournaments/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setCurrent(newStatus);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const options = ["UPCOMING", "LIVE", "COMPLETED"];
  const colors: Record<string, string> = {
    UPCOMING: "bg-blue-900 text-blue-300 border-blue-700",
    LIVE: "bg-red-900 text-red-300 border-red-700",
    COMPLETED: "bg-gray-800 text-gray-400 border-gray-600",
  };

  return (
    <div className="flex gap-1">
      {options.map((opt) => (
        <button key={opt} onClick={() => update(opt)} disabled={loading || current === opt}
          className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
            current === opt ? colors[opt] : "bg-gray-900 text-gray-600 border-gray-700 hover:border-gray-500"
          }`}>
          {opt === "UPCOMING" ? "Скоро" : opt === "LIVE" ? "LIVE" : "Завершён"}
        </button>
      ))}
    </div>
  );
}
