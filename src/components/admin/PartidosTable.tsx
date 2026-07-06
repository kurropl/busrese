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
    return <p className="text-gray-400 text-sm py-4">Sin partidos. Crea el primero arriba.</p>;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 text-left">
          <tr>
            <th className="px-3 py-2">Fecha</th>
            <th className="px-3 py-2">Rival</th>
            <th className="px-3 py-2">Comp.</th>
            <th className="px-3 py-2">Localidad</th>
            <th className="px-3 py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {partidos.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 capitalize">
                {format(parseISO(p.fecha), "d MMM yyyy", { locale: es })}
              </td>
              <td className="px-3 py-2 font-medium">{p.rival}</td>
              <td className="px-3 py-2 text-gray-500">{p.competicion}</td>
              <td className="px-3 py-2">
                <span className={p.localidad === "Local" ? "text-betis-green" : "text-gray-500"}>
                  {p.localidad}
                </span>
              </td>
              <td className="px-3 py-2 text-right space-x-2 whitespace-nowrap">
                <Link
                  to={`/admin/partido/${p.id}`}
                  className="text-betis-green hover:underline"
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
