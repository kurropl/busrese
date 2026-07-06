import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PhoenixIcon } from "./Icons";

export default function Header() {
  const { session } = useAuth();
  const loc = useLocation();
  const isAdmin = loc.pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="text-betis-green">
              <PhoenixIcon size={28} />
            </span>
            <div className="leading-none">
              <span className="block text-base font-bold tracking-tight text-slate-800">
                Peña Bética El Arco
              </span>
              <span className="block text-[10px] text-slate-400 font-medium tracking-wide">
                Rafael Villa · Autobús 26/27
              </span>
            </div>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/" className="text-slate-600 hover:text-betis-green transition-colors">
              Partidos
            </Link>
            {session ? (
              <Link to="/admin" className="text-slate-600 hover:text-betis-green transition-colors">
                Panel
              </Link>
            ) : (
              <Link to="/admin/login" className="text-slate-600 hover:text-betis-green transition-colors">
                Admin
              </Link>
            )}
            {isAdmin && session && (
              <span className="text-xs bg-betis-green/10 text-betis-green px-2.5 py-1 rounded-full font-medium">
                Admin
              </span>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
