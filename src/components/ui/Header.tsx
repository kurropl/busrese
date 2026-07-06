import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { session } = useAuth();
  const loc = useLocation();
  const isAdmin = loc.pathname.startsWith("/admin");

  return (
    <header className="bg-betis-dark text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">Peña Bética El Arco</span>
          <span className="hidden sm:inline text-betis-light text-sm">· Rafael Villa</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/" className="hover:text-betis-light">Partidos</Link>
          {session ? (
            <Link to="/admin" className="hover:text-betis-light">Panel</Link>
          ) : (
            <Link to="/admin/login" className="hover:text-betis-light">Admin</Link>
          )}
          {isAdmin && session && (
            <span className="text-xs bg-betis-green px-2 py-1 rounded">Admin</span>
          )}
        </nav>
      </div>
    </header>
  );
}
