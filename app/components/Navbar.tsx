"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|;)\\s*" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export function Navbar() {
  const path      = usePathname();
  const router    = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setRole(getCookie("role"));
  }, []);

  const isInsights = path === "/insights";
  const isManager  = path === "/manager";
  const isAdmin    = path === "/admin";

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const linkCls = (active: boolean) =>
    `text-sm px-4 py-2 rounded-lg transition-colors ${
      active
        ? "bg-gray-800 text-white"
        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
    }`;

  return (
    <nav className="border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <span className="text-amber-400 font-black text-xs tracking-widest">G4</span>
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">Lead Scorer</div>
            <div className="text-gray-400 text-[10px] leading-tight font-medium">Powered by Lucas de Paula</div>
          </div>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <Link href="/"        className={linkCls(!isManager && !isInsights && !isAdmin)}>Pipeline</Link>
          <Link href="/insights" className={linkCls(isInsights)}>Insights</Link>
          <Link href="/manager"  className={linkCls(isManager)}>Equipe</Link>
          {role === "admin" && (
            <Link href="/admin" className={linkCls(isAdmin)}>⚙️ Admin</Link>
          )}
        </div>

        {/* User + logout */}
        <div className="flex items-center gap-3">
          {role && (
            <span className={`text-xs px-2 py-1 rounded-md font-medium ${
              role === "admin"
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                : "bg-gray-700/50 text-gray-400 border border-gray-700"
            }`}>
              {role === "admin" ? "Admin" : "Viewer"}
            </span>
          )}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors disabled:opacity-50"
          >
            {loggingOut ? "Saindo..." : "Sair"}
          </button>
        </div>
      </div>
    </nav>
  );
}
