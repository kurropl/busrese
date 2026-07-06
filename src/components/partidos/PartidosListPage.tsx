import { useEffect, useState } from "react";
import { getPartidos, seedIfEmpty } from "../../lib/db";
import type { Partido } from "../../types";
import PartidoCard from "./PartidoCard";

export default function PartidosListPage() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        await seedIfEmpty();
        const list = await getPartidos();
        setPartidos(list);
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-center text-gray-500 py-10">Cargando partidos…</p>;
  if (err) return <p className="text-center text-red-500 py-10">{err}</p>;

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-betis-dark">Partidos · Temporada 26/27</h1>
        <p className="text-sm text-gray-500">
          Selecciona un partido para ver la asignación de plazas del autobús.
        </p>
      </div>
      {partidos.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="mb-2">No hay partidos dados de alta todavía.</p>
          <p className="text-sm">
            Entra en <span className="font-medium">Admin</span> para crear el primero.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partidos.map((p) => (
            <PartidoCard key={p.id} partido={p} />
          ))}
        </div>
      )}
    </section>
  );
}
