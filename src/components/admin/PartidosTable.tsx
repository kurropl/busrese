import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import type { Partido } from "../../types";

interface Props {
  partidos: Partido[];
  onDelete: (id: string) => Promise<void>;
  onTogglePublicar: (id: string, activo: boolean) => Promise<void>;
}

export default function PartidosTable({ partidos, onDelete, onTogglePublicar }: Props) {
  if (partidos.length === 0)
    return <p className="text-slate-400 text-sm py-4">Sin partidos. Crea el primero arriba.</p>;

  return (
    <div className="card overflow-x-auto p-0">
      <table className="w-full text-sm">
        <thead className="bg-slate-50/80 text-slate-500 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Fecha</th>
            <th className="px-4 py-3 font-medium">Rival</th>
            <th className="px-4 py-3 font-medium">Localidad</th>
            <th className="px-4 py-3 font-medium">Estado</th>
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
              <td className="px-4 py-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  p.localidad === "Local"
                    ? "bg-betis-green/10 text-betis-green"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {p.localidad}
                </span>
              </td>
              <td className="px-4 py-3">
                {p.activo ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Publicado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    Borrador
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                <Link
                  to={`/admin/partido/${p.id}`}
                  className="text-betis-green hover:underline font-medium"
                >
                  Editar bus
                </Link>
                <button
                  onClick={() => onTogglePublicar(p.id, !p.activo)}
                  className={
                    p.activo
                      ? "text-amber-600 hover:underline font-medium"
                      : "text-emerald-600 hover:underline font-medium"
                  }
                >
                  {p.activo ? "Despublicar" : "Publicar"}
                </button>
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
