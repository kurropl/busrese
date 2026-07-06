import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BackIcon, RefreshIcon, MenuIcon } from "./Icons";

export default function BottomNav() {
  const { session } = useAuth();
  const loc = useLocation();
  const navigate = useNavigate();
  const canGoBack = loc.pathname !== "/";

  return (
    <div className="bottom-nav">
      <button
        className="bottom-nav-btn"
        onClick={() => (canGoBack ? navigate(-1) : navigate("/"))}
        title="Atrás"
      >
        <BackIcon size={20} />
        <span>Atrás</span>
      </button>
      <button
        className="bottom-nav-btn"
        onClick={() => window.location.reload()}
        title="Recargar"
      >
        <RefreshIcon size={20} />
        <span>Recargar</span>
      </button>
      <Link to={session ? "/admin" : "/admin/login"} className="bottom-nav-btn" title="Menú">
        <MenuIcon size={20} />
        <span>Menú</span>
      </Link>
    </div>
  );
}
