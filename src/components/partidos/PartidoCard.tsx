import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import type { Partido } from "../../types";

export default function PartidoCard({ partido }: { partido: Partido }) {
  const ocupados = partido.asientos.filter((a) => a.estado === "Ocupado").length;
  const libres = partido.asientos.filter((a) => a.estado === "Libre").length;
  const fecha = format(parseISO(partido.fecha), "EEE d MMM yyyy", { locale: es });
  const isLocal = partido.localidad === "Local";

  return (
    <Link
      to={`/partido/${partido.id}`}
      className="card block hover:shadow-lg hover:border-betis-green/30 transition-all duration-200 group"
    >
      <div className="flex items-center justify-between mb-2.5">
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
          isLocal
            ? "bg-betis-green/10 text-betis-green"
            : "bg-slate-100 text-slate-500"
        }`}>
          {partido.localidad}
        </span>
        <span className="text-xs text-slate-400">{partido.competicion}</span>
      </div>
      <h3 className="text-lg font-bold text-slate-800 capitalize mb-1">{fecha}</h3>
      <p className="text-slate-600 text-sm">
        Betis <span className="text-slate-300 mx-1">vs</span>{" "}
        <span className="font-semibold text-slate-700">{partido.rival}</span>
      </p>

      {/* Horas destacadas */}
      {(partido.hora_partido || partido.hora_salida_bus) && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {partido.hora_salida_bus && (
            <div className="bg-emerald-50/80 border border-emerald-100 rounded-xl px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-emerald-600 font-semibold">Salida bus</p>
              <p className="text-base font-bold text-emerald-700">{partido.hora_salida_bus}</p>
            </div>
          )}
          {partido.hora_partido && (
            <div className="bg-slate-50/80 border border-slate-100 rounded-xl px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">Hora partido</p>
              <p className="text-base font-bold text-slate-700">{partido.hora_partido}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-3.5 flex gap-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          {ocupados} ocupadas
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          {libres} libres
        </span>
      </div>
    </Link>
  );
}
