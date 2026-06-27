"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

// ── Icons ─────────────────────────────────────────────────────────
function BoltIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function LogOutIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function LogInIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CS2Icon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ── NavItem ────────────────────────────────────────────────────────
interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}

function NavItem({ href, label, icon, active, collapsed, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={[
        "flex items-center gap-3 rounded-lg text-sm font-medium",
        "transition-all duration-150 border-l-2",
        collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5",
        active
          ? "text-prose bg-raised border-accent"
          : "text-dim hover:text-prose hover:bg-raised/60 border-transparent",
      ].join(" ")}
    >
      <span className={`shrink-0 transition-colors duration-150 ${active ? "text-accent" : ""}`}>
        {icon}
      </span>
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────
export interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  onClose,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as
    | { name?: string | null; email?: string | null; role?: string }
    | undefined;
  const isAdmin = user?.role === "ADMIN";

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  const inner = (
    <div className="flex flex-col h-full select-none">
      {/* ── Logo ── */}
      <div
        className={[
          "flex items-center h-14 border-b border-line shrink-0",
          collapsed ? "justify-center px-2 gap-0" : "justify-between px-4",
        ].join(" ")}
      >
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2.5 text-prose hover:text-accent transition-colors duration-150 min-w-0"
          title="CupsLog"
        >
          <BoltIcon className="text-accent shrink-0" />
          {!collapsed && (
            <span className="font-bold text-[17px] tracking-tight truncate">
              CupsLog
            </span>
          )}
        </Link>

        {/* Desktop — collapse toggle */}
        {!collapsed && (
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-lg hover:bg-raised transition-colors text-muted hover:text-dim shrink-0"
            aria-label="Свернуть панель"
          >
            <ChevronLeftIcon />
          </button>
        )}

        {/* Mobile — close */}
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg hover:bg-raised transition-colors text-muted shrink-0"
          aria-label="Закрыть меню"
        >
          <XIcon />
        </button>
      </div>

      {/* Desktop collapsed — expand button */}
      {collapsed && (
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex justify-center py-3 text-muted hover:text-dim transition-colors border-b border-line"
          aria-label="Развернуть панель"
        >
          <ChevronRightIcon />
        </button>
      )}

      {/* ── Game filter ── */}
      <div
        className={[
          "border-b border-line",
          collapsed ? "py-3 flex flex-col items-center gap-2" : "px-4 py-4",
        ].join(" ")}
      >
        {!collapsed && (
          <p className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-2.5">
            Игра
          </p>
        )}
        <div
          title={collapsed ? "CS2" : undefined}
          className={[
            "inline-flex items-center gap-1.5 font-semibold",
            "bg-accent/12 text-accent border border-accent/20 rounded-full",
            "transition-all duration-150",
            collapsed
              ? "w-9 h-9 justify-center"
              : "px-3 py-1.5 text-xs",
          ].join(" ")}
        >
          <CS2Icon className={collapsed ? "w-[15px] h-[15px]" : "w-3.5 h-3.5"} />
          {!collapsed && "CS2"}
        </div>
      </div>

      {/* ── Nav ── */}
      <nav
        className={[
          "flex-1 py-3 space-y-0.5 overflow-y-auto",
          collapsed ? "px-2" : "px-3",
        ].join(" ")}
      >
        {!collapsed && (
          <p className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-2 px-1">
            Навигация
          </p>
        )}
        <NavItem
          href="/tournaments"
          label="Турниры"
          icon={<TrophyIcon />}
          active={isActive("/tournaments")}
          collapsed={collapsed}
          onClick={onClose}
        />
        {isAdmin && (
          <NavItem
            href="/admin"
            label="Админ"
            icon={<ShieldIcon />}
            active={isActive("/admin")}
            collapsed={collapsed}
            onClick={onClose}
          />
        )}
      </nav>

      {/* ── Auth ── */}
      <div
        className={[
          "border-t border-line shrink-0",
          collapsed ? "px-2 py-3" : "px-4 py-3",
        ].join(" ")}
      >
        {session ? (
          <div
            className={[
              "flex items-center gap-3",
              collapsed ? "justify-center" : "",
            ].join(" ")}
          >
            {!collapsed && (
              <div className="flex-1 min-w-0">
                {user?.name && (
                  <p className="text-xs font-medium text-prose truncate">
                    {user.name}
                  </p>
                )}
                {user?.email && (
                  <p className="text-xs text-muted truncate">{user.email}</p>
                )}
              </div>
            )}
            <button
              onClick={() => signOut()}
              title="Выйти"
              className="p-1.5 rounded-lg hover:bg-raised text-muted hover:text-live transition-colors duration-150 shrink-0"
            >
              <LogOutIcon />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            onClick={onClose}
            title={collapsed ? "Войти" : undefined}
            className={[
              "flex items-center gap-2.5 text-sm text-dim hover:text-prose",
              "transition-colors duration-150",
              collapsed ? "justify-center" : "",
            ].join(" ")}
          >
            <LogInIcon />
            {!collapsed && "Войти"}
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop — in document flow */}
      <aside
        className={[
          "hidden md:flex flex-col shrink-0",
          "bg-card border-r border-line overflow-hidden",
          "transition-all duration-300 ease-out",
          collapsed ? "w-[56px]" : "w-[220px]",
        ].join(" ")}
      >
        {inner}
      </aside>

      {/* Mobile — fixed overlay */}
      <aside
        className={[
          "md:hidden fixed inset-y-0 left-0 z-50",
          "flex flex-col w-[240px]",
          "bg-card border-r border-line",
          "transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-hidden={!mobileOpen}
      >
        {inner}
      </aside>
    </>
  );
}
