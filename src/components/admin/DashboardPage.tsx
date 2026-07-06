import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getPartidos, createPartido, deletePartido } from "../../lib/db";
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

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-betis-dark">Panel de administración</h1>
          <p className="text-sm text-gray-500">Alta de partidos y gestión de plazas.</p>
        </div>
        <button
          onClick={async () => {
            await signOut();
            nav("/");
          }}
          className="text-sm text-gray-500 hover:text-red-500"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="mb-6">
        <PartidoForm onCreate={handleCreate} />
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando…</p>
      ) : (
        <PartidosTable partidos={partidos} onDelete={handleDelete} />
      )}
    </section>
  );
}
