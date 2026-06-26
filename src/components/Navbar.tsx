"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
      <Link href="/" className="text-white font-bold text-xl tracking-tight">
        CupsLog
      </Link>
      <div className="flex items-center gap-6 text-sm">
        <Link href="/tournaments" className="text-gray-300 hover:text-white transition-colors">
          Турниры
        </Link>
        {isAdmin && (
          <Link href="/admin" className="text-yellow-400 hover:text-yellow-300 transition-colors">
            Админ
          </Link>
        )}
        {session ? (
          <button
            onClick={() => signOut()}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Выйти
          </button>
        ) : (
          <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
            Войти
          </Link>
        )}
      </div>
    </nav>
  );
}
