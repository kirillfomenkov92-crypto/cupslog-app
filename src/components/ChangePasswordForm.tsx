"use client";
import { useState } from "react";
import { toast } from "sonner";

const inputBase =
  "bg-raised border rounded-lg px-3 py-2 text-sm text-prose placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors";

function WarnIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 mt-0.5"
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export default function ChangePasswordForm({
  insecureSecret,
}: {
  insecureSecret: boolean;
}) {
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
    <div className="bg-card border border-line rounded-xl p-5 max-w-md">
      {insecureSecret && (
        <div className="flex items-start gap-2 mb-4 p-3 rounded-lg bg-yellow-500/8 border border-yellow-500/25 text-yellow-400 text-sm">
          <WarnIcon />
          <span>
            NEXTAUTH_SECRET не изменён. Замени его на случайное значение перед
            выходом в продакшен.
          </span>
        </div>
      )}
      <h2 className="text-base font-semibold text-prose mb-4">Сменить пароль</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cp-current" className="text-xs font-medium text-dim">
            Текущий пароль
          </label>
          <input
            id="cp-current"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
            className={`${inputBase} ${fieldErrors.currentPassword ? "border-live" : "border-line"}`}
          />
          {fieldErrors.currentPassword && (
            <span className="text-live text-xs">{fieldErrors.currentPassword}</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cp-new" className="text-xs font-medium text-dim">
            Новый пароль{" "}
            <span className="text-muted font-normal">(мин. 8 символов)</span>
          </label>
          <input
            id="cp-new"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
            className={`${inputBase} ${fieldErrors.newPassword ? "border-live" : "border-line"}`}
          />
          {fieldErrors.newPassword && (
            <span className="text-live text-xs">{fieldErrors.newPassword}</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cp-confirm" className="text-xs font-medium text-dim">
            Подтвердить пароль
          </label>
          <input
            id="cp-confirm"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            className={`${inputBase} ${fieldErrors.confirmPassword ? "border-live" : "border-line"}`}
          />
          {fieldErrors.confirmPassword && (
            <span className="text-live text-xs">{fieldErrors.confirmPassword}</span>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-accent hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors mt-1 active:scale-[0.98]"
        >
          {loading ? "Сохраняется..." : "Сменить пароль"}
        </button>
      </form>
    </div>
  );
}
