import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import type { Partido } from "../../types";

interface Props {
  partidos: Partido[];
  onDelete: (id: string) => Promise<void>;
}

export default function PartidosTable({ partidos, onDelete }: Props) {
  if (partidos.length === 0)
    return <p className="text-slate-400 text-sm py-4">Sin partidos. Crea el primero arriba.</p>;

  return (
    <div className="card overflow-x-auto p-0">
      <table className="w-full text-sm">
        <thead className="bg-slate-50/80 text-slate-500 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Fecha</th>
            <th className="px-4 py-3 font-medium">Rival</th>
            <th className="px-4 py-3 font-medium">Comp.</th>
            <th className="px-4 py-3 font-medium">Localidad</th>
            <th className="px-4 py-3 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {partidos.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-3 capitalize text-slate-700">
                {format(parseISO(p.fecha), "d MMM yyyy", { locale: es })}
              </td>
              <td className="px-4 py-3 font-medium text-slate-800">{p.rival}</td>
              <td className="px-4 py-3 text-slate-500">{p.competicion}</td>
              <td className="px-4 py-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  p.localidad === "Local"
                    ? "bg-betis-green/10 text-betis-green"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {p.localidad}
                </span>
              </td>
              <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                <Link
                  to={`/admin/partido/${p.id}`}
                  className="text-betis-green hover:underline font-medium"
                >
                  Editar bus
                </Link>
                <button
                  onClick={() => {
                    if (confirm(`¿Eliminar el partido vs ${p.rival}?`)) onDelete(p.id);
                  }}
                  className="text-red-500 hover:underline"
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
