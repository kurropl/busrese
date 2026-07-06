import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { getPartido } from "../../lib/db";
import type { Partido } from "../../types";
import BusMap from "./BusMap";
import Legend from "../ui/Legend";

export default function BusViewPage() {
  const { id } = useParams();
  const [partido, setPartido] = useState<Partido | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!id) return;
    getPartido(id)
      .then(setPartido)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center text-gray-500 py-10">Cargando autobús…</p>;
  if (err) return <p className="text-center text-red-500 py-10">{err}</p>;
  if (!partido)
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-3">Partido no encontrado.</p>
        <Link to="/" className="text-betis-green hover:underline">Volver al listado</Link>
      </div>
    );

  const fecha = format(parseISO(partido.fecha), "EEEE d 'de' MMMM 'de' yyyy", { locale: es });

  return (
    <section>
      <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
        <div>
          <Link to="/" className="text-sm text-betis-green hover:underline">← Partidos</Link>
          <h1 className="text-2xl font-bold text-betis-dark capitalize">{fecha}</h1>
          <p className="text-gray-600">
            Betis vs <span className="font-medium">{partido.rival}</span> ·{" "}
            <span className="text-betis-green">{partido.localidad}</span> · {partido.competicion}
          </p>
        </div>
        <Legend />
      </div>
      <BusMap asientos={partido.asientos} />
    </section>
  );
}
