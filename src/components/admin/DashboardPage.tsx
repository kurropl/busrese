import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getPartidos, createPartido, deletePartido, togglePublicarPartido } from "../../lib/db";
import type { Partido, PartidoInput } from "../../types";
import PartidoForm from "./PartidoForm";
import PartidosTable from "./PartidosTable";

export default function DashboardPage() {
  const { signOut } = useAuth();
  const nav = useNavigate();
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    getPartidos()
      .then(setPartidos)
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (input: PartidoInput) => {
    const p = await createPartido(input);
    setPartidos((prev) => [...prev, p].sort((a, b) => a.fecha.localeCompare(b.fecha)));
  };

  const handleDelete = async (id: string) => {
    await deletePartido(id);
    setPartidos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleTogglePublicar = async (id: string, activo: boolean) => {
    await togglePublicarPartido(id, activo);
    setPartidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, activo } : p))
    );
  };

  const publicados = partidos.filter((p) => p.activo).length;

  return (
    <section>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Panel de administración</h1>
          <p className="text-sm text-slate-500 mt-1">
            {partidos.length} partidos · {publicados} publicados · {partidos.length - publicados} borradores
          </p>
        </div>
        <button
          onClick={async () => {
            await signOut();
            nav("/");
          }}
          className="text-sm text-slate-500 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="mb-6">
        <PartidoForm onCreate={handleCreate} />
      </div>

      {loading ? (
        <p className="text-slate-400">Cargando…</p>
      ) : (
        <PartidosTable
          partidos={partidos}
          onDelete={handleDelete}
          onTogglePublicar={handleTogglePublicar}
        />
      )}
    </section>
  );
}
