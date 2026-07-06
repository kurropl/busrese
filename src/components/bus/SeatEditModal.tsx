import { useState } from "react";
import type { Asiento } from "../../types";

interface Props {
  asiento: Asiento;
  baseAsiento: Asiento; // estado original de la Matriz B para "Restaurar"
  onClose: () => void;
  onApply: (next: Asiento) => void;
}

export default function SeatEditModal({ asiento, baseAsiento, onClose, onApply }: Props) {
  const [nuevoNombre, setNuevoNombre] = useState(asiento.ocupante || "");
  const [msg, setMsg] = useState("");

  const etiqueta =
    asiento.numero != null ? `Asiento ${asiento.numero}` : asiento.ocupante || asiento.id;

  const desasignar = () => {
    onApply({ ...asiento, estado: "Libre", ocupante: null });
    onClose();
  };

  const sustituir = () => {
    const nombre = nuevoNombre.trim();
    if (!nombre) {
      setMsg("Introduce un nombre.");
      return;
    }
    // Mantiene el estado (Ocupado / Conductor / Guia); solo cambia el ocupante
    onApply({ ...asiento, ocupante: nombre });
    onClose();
  };

  const restaurar = () => {
    onApply({ ...asiento, estado: baseAsiento.estado, ocupante: baseAsiento.ocupante });
    onClose();
  };

  const cambiado =
    asiento.estado !== baseAsiento.estado || asiento.ocupante !== baseAsiento.ocupante;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-betis-dark">{etiqueta}</h2>
            <p className="text-xs text-gray-500">
              Fila {asiento.fila} · {asiento.lado} · {asiento.posicion}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="mb-4 text-sm">
          <p>
            Estado actual:{" "}
            <span className="font-medium">{asiento.estado}</span>
          </p>
          <p>
            Ocupante:{" "}
            <span className="font-medium">{asiento.ocupante || "—"}</span>
          </p>
          {cambiado && (
            <p className="mt-1 text-xs text-amber-600">
              Modificado respecto a la configuración base.
            </p>
          )}
        </div>

        {/* Sustituir */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Sustituir ocupante
          </label>
          <div className="flex gap-2">
            <input
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              placeholder="Nombre del nuevo ocupante"
              className="flex-1 rounded border border-gray-300 px-2 py-1.5 text-sm"
            />
            <button
              onClick={sustituir}
              className="bg-betis-green text-white rounded px-3 py-1.5 text-sm font-medium hover:bg-betis-dark"
            >
              Sustituir
            </button>
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={desasignar}
            disabled={asiento.estado === "Libre"}
            className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-40"
          >
            Desasignar
          </button>
          <button
            onClick={restaurar}
            disabled={!cambiado}
            className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-40"
          >
            Restaurar base
          </button>
        </div>

        {msg && <p className="text-xs text-red-500 mt-2">{msg}</p>}
      </div>
    </div>
  );
}
