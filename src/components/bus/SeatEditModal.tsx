import { useState } from "react";
import type { Asiento } from "../../types";

interface Props {
  asiento: Asiento;
  baseAsiento: Asiento;
  onClose: () => void;
  onApply: (next: Asiento) => void;
}

export default function SeatEditModal({ asiento, baseAsiento, onClose, onApply }: Props) {
  const [nuevoNombre, setNuevoNombre] = useState(asiento.ocupante || "");
  const [msg, setMsg] = useState("");

  const isFrontal = asiento.estado === "Conductor" || asiento.estado === "Guia";
  const etiqueta = isFrontal
    ? asiento.ocupante || asiento.id
    : `Asiento ${asiento.numero}`;

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
    onApply({ ...asiento, estado: "Ocupado", ocupante: nombre });
    onClose();
  };

  const restaurar = () => {
    onApply({ ...asiento, estado: baseAsiento.estado, ocupante: baseAsiento.ocupante });
    onClose();
  };

  const cambiado =
    asiento.estado !== baseAsiento.estado || asiento.ocupante !== baseAsiento.ocupante;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-sm p-6 border border-white/60">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{etiqueta}</h2>
            <p className="text-xs text-slate-400">
              Fila {asiento.fila} · {asiento.lado} · {asiento.posicion}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-slate-500 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mb-5 text-sm bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100">
          <div className="flex justify-between mb-1.5">
            <span className="text-slate-500">Estado actual</span>
            <span className="font-semibold text-slate-800">{asiento.estado}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Ocupante</span>
            <span className="font-semibold text-slate-800">{asiento.ocupante || "—"}</span>
          </div>
          {cambiado && (
            <p className="mt-2.5 text-xs text-amber-600 border-t border-amber-100 pt-2">
              Modificado respecto a la configuración base.
            </p>
          )}
        </div>

        {/* Sustituir */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Sustituir ocupante
          </label>
          <div className="flex gap-2">
            <input
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sustituir()}
              placeholder="Nombre del nuevo ocupante"
              className="flex-1 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm focus:border-betis-green focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              autoFocus
            />
            <button
              onClick={sustituir}
              className="btn-primary whitespace-nowrap"
            >
              Sustituir
            </button>
          </div>
        </div>

        <div className="flex gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={desasignar}
            disabled={asiento.estado === "Libre"}
            className="btn-secondary flex-1"
          >
            Desasignar
          </button>
          <button
            onClick={restaurar}
            disabled={!cambiado}
            className="btn-secondary flex-1"
          >
            Restaurar base
          </button>
        </div>

        {msg && <p className="text-xs text-red-500 mt-2">{msg}</p>}
      </div>
    </div>
  );
}
