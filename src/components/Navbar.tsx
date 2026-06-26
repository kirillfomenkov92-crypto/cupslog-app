"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

function BoltIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

export default function Navbar() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  function closeMenu() {
    setMenuOpen(false);
  }

  function navClass(href: string) {
    const isActive =
      href === "/"
        ? pathname === "/"
        : pathname === href || pathname.startsWith(href + "/");
    return [
      "text-sm transition-colors duration-150",
      isActive
        ? "text-prose font-medium underline underline-offset-4 decoration-accent decoration-2"
        : "text-dim hover:text-prose",
    ].join(" ");
  }

  return (
    <nav className="bg-card border-b border-line sticky top-0 z-40 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-2 font-bold text-xl tracking-tight text-prose hover:text-accent transition-colors duration-150"
        >
          <span className="text-accent">
            <BoltIcon />
          </span>
          CupsLog
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-8">
          <Link href="/tournaments" className={navClass("/tournaments")}>
            Турниры
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors duration-150"
            >
              Админ
            </Link>
          )}
          {session ? (
            <button
              onClick={() => signOut()}
              className="text-sm text-dim hover:text-prose transition-colors duration-150"
            >
              Выйти
            </button>
          ) : (
            <Link href="/login" className={navClass("/login")}>
              Войти
            </Link>
          )}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menuOpen}
          className="sm:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-raised transition-colors duration-150"
        >
          <span
            className={`block h-0.5 w-5 bg-dim transition-transform duration-200 ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-dim transition-opacity duration-200 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-dim transition-transform duration-200 ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t border-line px-6 py-4 flex flex-col gap-4 bg-card">
          <Link
            href="/tournaments"
            onClick={closeMenu}
            className="text-sm text-dim hover:text-prose transition-colors duration-150"
          >
            Турниры
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              onClick={closeMenu}
              className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors duration-150"
            >
              Админ
            </Link>
          )}
          {session ? (
            <button
              onClick={() => {
                signOut();
                closeMenu();
              }}
              className="text-left text-sm text-dim hover:text-prose transition-colors duration-150"
            >
              Выйти
            </button>
          ) : (
            <Link
              href="/login"
              onClick={closeMenu}
              className="text-sm text-dim hover:text-prose transition-colors duration-150"
            >
              Войти
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
