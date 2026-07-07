import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { getPartido, confirmarAsiento } from "../../lib/db";
import type { Asiento, Partido } from "../../types";
import BusMap from "../bus/BusMap";
import { CheckIcon, XIcon } from "../ui/Icons";

export default function ConfirmarPage() {
  const { partidoId } = useParams<{ partidoId: string }>();
  const [partido, setPartido] = useState<Partido | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Asiento | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState<Asiento | null>(null);

  useEffect(() => {
    if (!partidoId) return;
    getPartido(partidoId).then((p) => {
      setPartido(p);
      setLoading(false);
    });
  }, [partidoId]);

  async function handleConfirmar(confirmacion: "confirmado" | "cancelado") {
    if (!partido || !selected) return;
    setSaving(true);
    await confirmarAsiento(partido.id, selected.id, confirmacion);
    // Actualizar estado local
    const updatedAsientos = partido.asientos.map((a) =>
      a.id === selected.id ? { ...a, confirmado: confirmacion } : a
    );
    setPartido({ ...partido, asientos: updatedAsientos });
    setDone({ ...selected, confirmado: confirmacion });
    setSelected(null);
    setSaving(false);
  }

  if (loading) {
    return <div className="p-10 text-center text-slate-400">Cargando…</div>;
  }

  if (!partido) {
    return (
      <div className="p-10 text-center">
        <p className="text-slate-500 mb-4">No se encontró el partido.</p>
        <a href="/" className="btn-primary inline-block">Volver al inicio</a>
      </div>
    );
  }

  const fecha = format(parseISO(partido.fecha), "EEEE d 'de' MMMM 'de' yyyy", { locale: es });
  const ocupados = partido.asientos.filter((a) => a.estado === "Ocupado");
  const confirmados = ocupados.filter((a) => a.confirmado === "confirmado").length;
  const cancelados = ocupados.filter((a) => a.confirmado === "cancelado").length;
  const pendientes = ocupados.length - confirmados - cancelados;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Cabecera del partido */}
      <div className="card mb-4 text-center">
        <p className="text-xs uppercase tracking-widest text-emerald-600 font-semibold mb-1">
          {partido.localidad} · {partido.competicion}
        </p>
        <h1 className="text-2xl font-bold text-slate-800">Betis vs {partido.rival}</h1>
        <p className="text-slate-500 text-sm mt-1 capitalize">{fecha}</p>

        {/* Horas destacadas */}
        {(partido.hora_partido || partido.hora_salida_bus) && (
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            {partido.hora_salida_bus && (
              <div className="bg-emerald-50/80 border border-emerald-100 rounded-xl px-4 py-2">
                <p className="text-[10px] uppercase tracking-wide text-emerald-600 font-semibold">Salida del bus</p>
                <p className="text-lg font-bold text-emerald-700">{partido.hora_salida_bus}</p>
              </div>
            )}
            {partido.hora_partido && (
              <div className="bg-slate-50/80 border border-slate-100 rounded-xl px-4 py-2">
                <p className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">Hora del partido</p>
                <p className="text-lg font-bold text-slate-700">{partido.hora_partido}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Resumen de confirmaciones */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="card text-center py-3">
          <p className="text-2xl font-bold text-emerald-600">{confirmados}</p>
          <p className="text-[10px] uppercase tracking-wide text-slate-400">Confirmados</p>
        </div>
        <div className="card text-center py-3">
          <p className="text-2xl font-bold text-slate-400">{pendientes}</p>
          <p className="text-[10px] uppercase tracking-wide text-slate-400">Pendientes</p>
        </div>
        <div className="card text-center py-3">
          <p className="text-2xl font-bold text-red-500">{cancelados}</p>
          <p className="text-[10px] uppercase tracking-wide text-slate-400">Cancelados</p>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="card mb-4 bg-emerald-50/50 border-emerald-200">
        <p className="text-sm text-slate-600 text-center">
          Busca tu asiento en el mapa y pulsa sobre él para confirmar tu asistencia.
        </p>
      </div>

      {/* Mapa del bus */}
      <BusMap
        asientos={partido.asientos}
        clickable
        onSeatClick={(a) => {
          if (a.estado === "Ocupado") setSelected(a);
        }}
      />

      {/* Leyenda de confirmación */}
      <div className="flex flex-wrap justify-center gap-3 mt-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-slate-300 border border-slate-400"></span>
          Pendiente
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-emerald-500 border border-emerald-700"></span>
          Confirmado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-red-500 border border-red-700"></span>
          Cancelado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-emerald-500 border border-emerald-700"></span>
          Libre
        </span>
      </div>

      {/* Modal de confirmación */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-slate-800 mb-1">Asiento {selected.numero}</h2>
            <p className="text-slate-500 mb-4">
              ¿Eres <span className="font-semibold">{selected.ocupante}</span>?
            </p>

            {selected.confirmado && (
              <p className="text-sm text-slate-400 mb-3">
                Ya has marcado: <strong>{selected.confirmado === "confirmado" ? "Confirmado" : "No puedo ir"}</strong>. Puedes cambiarlo.
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => handleConfirmar("confirmado")}
                disabled={saving}
                className="flex-1 bg-emerald-600 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all disabled:opacity-50"
              >
                <CheckIcon size={18} />
                Confirmo
              </button>
              <button
                onClick={() => handleConfirmar("cancelado")}
                disabled={saving}
                className="flex-1 bg-red-500 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-red-600 transition-all disabled:opacity-50"
              >
                <XIcon size={18} />
                No puedo ir
              </button>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="w-full mt-3 text-slate-400 text-sm hover:text-slate-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Toast de confirmación */}
      {done && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-5 py-3 rounded-xl shadow-lg z-50 text-sm flex items-center gap-2"
          onClick={() => setDone(null)}
        >
          {done.confirmado === "confirmado" ? (
            <><CheckIcon size={16} /> ¡Gracias, {done.ocupante}! Plaza confirmada.</>
          ) : (
            <><XIcon size={16} /> Has cancelado tu plaza. Si es un error, vuelve a pulsar tu asiento.</>
          )}
        </div>
      )}
    </div>
  );
}
