import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Header from "./components/ui/Header";
import BottomNav from "./components/ui/BottomNav";
import PartidosListPage from "./components/partidos/PartidosListPage";
import BusViewPage from "./components/bus/BusViewPage";
import LoginPage from "./components/admin/LoginPage";
import DashboardPage from "./components/admin/DashboardPage";
import BusEditPage from "./components/bus/BusEditPage";

function Protected({ children }: { children: JSX.Element }) {
  const { session, loading } = useAuth();
  if (loading) return <div className="p-10 text-center text-slate-400">Cargando…</div>;
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
      <BottomNav />
    </div>
  );
}
