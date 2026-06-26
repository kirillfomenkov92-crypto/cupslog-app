"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      setError("Неверный email или пароль");
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-60px)]">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-sm flex flex-col gap-4"
      >
        <h1 className="text-xl font-semibold text-center">Вход</h1>
        {error && (
          <p role="alert" aria-live="polite" className="text-red-400 text-sm text-center">{error}</p>
        )}
        <input
          type="email"
          name="email"
          aria-label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          spellCheck={false}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:border-gray-500"
        />
        <input
          type="password"
          name="password"
          aria-label="Пароль"
          placeholder="Пароль"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:border-gray-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
