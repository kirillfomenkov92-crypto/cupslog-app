"use client";
import { useState } from "react";
import { toast } from "sonner";

export default function ChangePasswordForm({ insecureSecret }: { insecureSecret: boolean }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.field) setFieldErrors({ [data.field]: data.error });
        toast.error(data.error ?? "Ошибка при смене пароля");
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Пароль изменён");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md">
      {insecureSecret && (
        <div className="mb-4 p-3 rounded-lg bg-yellow-900/40 border border-yellow-700 text-yellow-300 text-sm">
          ⚠️ NEXTAUTH_SECRET не изменён. Замени его на случайное значение перед выходом в продакшен.
        </div>
      )}
      <h2 className="text-lg font-semibold mb-4">Сменить пароль</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <input
            type="password"
            placeholder="Текущий пароль"
            aria-label="Текущий пароль"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
            className={`bg-gray-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${fieldErrors.currentPassword ? "border-red-500" : "border-gray-700"}`}
          />
          {fieldErrors.currentPassword && <span className="text-red-400 text-xs">{fieldErrors.currentPassword}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <input
            type="password"
            placeholder="Новый пароль (мин. 8 символов)"
            aria-label="Новый пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
            className={`bg-gray-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${fieldErrors.newPassword ? "border-red-500" : "border-gray-700"}`}
          />
          {fieldErrors.newPassword && <span className="text-red-400 text-xs">{fieldErrors.newPassword}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <input
            type="password"
            placeholder="Подтверди новый пароль"
            aria-label="Подтверждение нового пароля"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            className={`bg-gray-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${fieldErrors.confirmPassword ? "border-red-500" : "border-gray-700"}`}
          />
          {fieldErrors.confirmPassword && <span className="text-red-400 text-xs">{fieldErrors.confirmPassword}</span>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Сохраняется..." : "Сменить пароль"}
        </button>
      </form>
    </div>
  );
}
