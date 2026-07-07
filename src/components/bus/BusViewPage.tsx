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

  if (loading) return <p className="text-center text-slate-400 py-10">Cargando autobús…</p>;
  if (err) return <p className="text-center text-red-500 py-10">{err}</p>;
  if (!partido)
    return (
      <div className="text-center py-10">
        <p className="text-slate-500 mb-3">Partido no encontrado.</p>
        <Link to="/" className="text-betis-green hover:underline">Volver al listado</Link>
      </div>
    );

  const fecha = format(parseISO(partido.fecha), "EEEE d 'de' MMMM 'de' yyyy", { locale: es });

  return (
    <section>
      <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link to="/" className="text-sm text-betis-green hover:underline">← Partidos</Link>
          <h1 className="text-2xl font-bold text-slate-800 capitalize mt-1">{fecha}</h1>
          <p className="text-slate-500 text-sm">
            Betis vs <span className="font-semibold text-slate-700">{partido.rival}</span> ·{" "}
            <span className="text-betis-green font-medium">{partido.localidad}</span> · {partido.competicion}
          </p>

          {/* Horas destacadas */}
          {(partido.hora_partido || partido.hora_salida_bus) && (
            <div className="mt-3 flex flex-wrap gap-3">
              {partido.hora_salida_bus && (
                <div className="bg-emerald-50/80 border border-emerald-100 rounded-xl px-4 py-2.5">
                  <p className="text-[10px] uppercase tracking-wide text-emerald-600 font-semibold">Salida del bus</p>
                  <p className="text-xl font-bold text-emerald-700">{partido.hora_salida_bus}</p>
                </div>
              )}
              {partido.hora_partido && (
                <div className="bg-slate-50/80 border border-slate-100 rounded-xl px-4 py-2.5">
                  <p className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">Hora del partido</p>
                  <p className="text-xl font-bold text-slate-700">{partido.hora_partido}</p>
                </div>
              )}
            </div>
          )}
        </div>
        <Legend />
      </div>
      <BusMap asientos={partido.asientos} />
    </section>
  );
}
