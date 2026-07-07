import { useState } from "react";
import type { Partido } from "../../types";

interface Props {
  partido: Partido;
  onClose: () => void;
  onConfirm: (datos: { fecha: string; hora_partido: string; hora_salida_bus: string }) => Promise<void>;
}

export default function PublicarModal({ partido, onClose, onConfirm }: Props) {
  const [fecha, setFecha] = useState(partido.fecha);
  const [horaPartido, setHoraPartido] = useState(partido.hora_partido || "");
  const [horaSalida, setHoraSalida] = useState(partido.hora_salida_bus || "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    if (!fecha) {
      setErr("La fecha es obligatoria.");
      return;
    }
    if (!horaPartido) {
      setErr("La hora del partido es obligatoria.");
      return;
    }
    if (!horaSalida) {
      setErr("La hora de salida del bus es obligatoria.");
      return;
    }
    setErr("");
    setBusy(true);
    try {
      await onConfirm({ fecha, hora_partido: horaPartido, hora_salida_bus: horaSalida });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error al publicar");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-6 border border-white/60">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Publicar partido</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Betis vs <span className="font-semibold">{partido.rival}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-slate-500 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-3 mb-5">
          <p className="text-xs text-amber-700">
            Al publicar, la fecha y horas pasan a ser definitivas y visibles para todos los socios.
            La fecha actual ({partido.fecha}) es orientativa.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Fecha exacta del partido
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm focus:border-betis-green focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Hora del partido
            </label>
            <input
              type="time"
              value={horaPartido}
              onChange={(e) => setHoraPartido(e.target.value)}
              required
              placeholder="18:30"
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm focus:border-betis-green focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Hora de salida del bus
            </label>
            <input
              type="time"
              value={horaSalida}
              onChange={(e) => setHoraSalida(e.target.value)}
              required
              placeholder="16:00"
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm focus:border-betis-green focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
            />
            <p className="text-xs text-slate-400 mt-1">
              Hora de salida desde el punto de encuentro de la peña.
            </p>
          </div>
        </div>

        {err && <p className="text-sm text-red-500 mt-3">{err}</p>}

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="btn-secondary flex-1"
            disabled={busy}
          >
            Cancelar
          </button>
          <button
            onClick={submit}
            disabled={busy}
            className="flex-1 bg-betis-green text-white rounded-xl py-2.5 text-sm font-medium hover:bg-betis-dark disabled:opacity-50 transition-all"
          >
            {busy ? "Publicando…" : "Publicar"}
          </button>
        </div>
      </div>
    </div>
  );
}
