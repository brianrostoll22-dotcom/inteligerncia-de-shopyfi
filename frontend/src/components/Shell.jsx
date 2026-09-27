import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, CreditCard, UserRound, ShieldCheck, LogOut, Zap } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const LINKS = [
  { to: "/app", label: "Panel", icon: LayoutDashboard, testid: "nav-panel" },
  { to: "/app/planes", label: "Depósitos", icon: CreditCard, testid: "nav-planes" },
  { to: "/app/perfil", label: "Perfil", icon: UserRound, testid: "nav-perfil" },
];

export default function Shell({ children }) {
  const { user, setUser } = useAuth();
  const { pathname } = useLocation();

  const logout = async () => {
    try {
      await api("/auth/logout", { method: "POST" });
    } catch {}
    setUser(false);
  };

  return (
    <div className="min-h-screen bg-night">
      <header className="sticky top-0 z-40 glass border-b border-edge">
        <div className="mx-auto max-w-7xl px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <Link to="/app" data-testid="shell-logo" className="flex items-center gap-2 shrink-0">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal text-night">
              <Zap className="w-4.5 h-4.5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-sm tracking-wide">NovaIA</span>
          </Link>

          <nav className="flex items-center gap-1 md:gap-2 overflow-x-auto">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                data-testid={l.testid}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  pathname === l.to ? "bg-card text-teal" : "text-mist hover:text-white"
                }`}
              >
                <l.icon className="w-4 h-4" />
                {l.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                data-testid="nav-admin"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  pathname === "/admin" ? "bg-card text-lav" : "text-mist hover:text-white"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Perfil" className="w-8 h-8 rounded-full object-cover border border-edge" />
            ) : (
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-card border border-edge text-teal text-sm font-semibold">
                {(user?.first_name || user?.email || "?")[0].toUpperCase()}
              </span>
            )}
            <button
              onClick={logout}
              data-testid="nav-logout"
              aria-label="Cerrar sesión"
              className="text-mist hover:text-danger transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 md:px-8 py-8 md:py-12">{children}</main>
    </div>
  );
}
