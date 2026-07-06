import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import type { Partido } from "../../types";

export default function PartidoCard({ partido }: { partido: Partido }) {
  const ocupados = partido.asientos.filter((a) => a.estado === "Ocupado").length;
  const libres = partido.asientos.filter((a) => a.estado === "Libre").length;
  const fecha = format(parseISO(partido.fecha), "EEE d MMM yyyy", { locale: es });

  return (
    <Link
      to={`/partido/${partido.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md hover:border-betis-light transition"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium uppercase tracking-wide text-betis-green">
          {partido.localidad}
        </span>
        <span className="text-xs text-gray-400">{partido.competicion}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 capitalize">{fecha}</h3>
      <p className="text-gray-600">
        Betis <span className="text-gray-400 mx-1">vs</span>{" "}
        <span className="font-medium">{partido.rival}</span>
      </p>
      <div className="mt-3 flex gap-3 text-xs text-gray-500">
        <span>{ocupados} ocupadas</span>
        <span>{libres} libres</span>
      </div>
    </Link>
  );
}
