import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Header from "./components/ui/Header";
import PartidosListPage from "./components/partidos/PartidosListPage";
import BusViewPage from "./components/bus/BusViewPage";
import LoginPage from "./components/admin/LoginPage";
import DashboardPage from "./components/admin/DashboardPage";
import BusEditPage from "./components/bus/BusEditPage";

function Protected({ children }: { children: JSX.Element }) {
  const { session, loading } = useAuth();
  if (loading) return <div className="p-10 text-center text-gray-500">Cargando…</div>;
  return session ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<PartidosListPage />} />
          <Route path="/partido/:id" element={<BusViewPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <Protected>
                <DashboardPage />
              </Protected>
            }
          />
          <Route
            path="/admin/partido/:id"
            element={
              <Protected>
                <BusEditPage />
              </Protected>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        Peña Bética Cultural El Arco · Rafael Villa · Temporada 26/27
      </footer>
    </div>
  );
}
