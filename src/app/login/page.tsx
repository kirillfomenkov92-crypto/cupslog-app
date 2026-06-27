"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Неверный email или пароль");
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="animate-page-in flex items-center justify-center min-h-[calc(100dvh-56px)] md:min-h-dvh px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-card border border-line rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4"
      >
        <div className="mb-1">
          <h1 className="text-xl font-semibold text-prose text-center">Вход</h1>
          <p className="text-dim text-sm text-center mt-1">CupsLog Admin</p>
        </div>

        {error && (
          <p
            role="alert"
            aria-live="polite"
            className="text-live text-sm text-center bg-live/8 border border-live/20 rounded-lg px-3 py-2"
          >
            {error}
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-email" className="text-xs font-medium text-dim">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            spellCheck={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-raised border border-line rounded-lg px-4 py-2.5 text-sm text-prose placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-password" className="text-xs font-medium text-dim">
            Пароль
          </label>
          <input
            id="login-password"
            type="password"
            name="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-raised border border-line rounded-lg px-4 py-2.5 text-sm text-prose placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-accent hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-150 mt-1 active:scale-[0.98]"
        >
          {loading ? "Вхожу..." : "Войти"}
        </button>
      </form>
    </div>
  );
}
