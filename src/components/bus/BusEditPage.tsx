import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { getPartido, updatePartidoAsientos, getConfigBase } from "../../lib/db";
import type { Asiento, Partido } from "../../types";
import BusMap from "./BusMap";
import SeatEditModal from "./SeatEditModal";
import Legend from "../ui/Legend";

export default function BusEditPage() {
  const { id } = useParams();
  const [partido, setPartido] = useState<Partido | null>(null);
  const [base, setBase] = useState<Asiento[]>([]);
  const [selected, setSelected] = useState<Asiento | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    setBase(getConfigBase());
    if (!id) return;
    getPartido(id)
      .then(setPartido)
      .finally(() => setLoading(false));
  }, [id]);

  const guardarAsientos = useCallback(async (asientos: Asiento[]) => {
    if (!id) return;
    setSaving(true);
    try {
      await updatePartidoAsientos(id, asientos);
      setSavedMsg("Guardado");
      setTimeout(() => setSavedMsg(""), 2000);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }, [id]);

  const applyChange = (next: Asiento) => {
    if (!partido) return;
    const asientos = partido.asientos.map((a) => (a.id === next.id ? next : a));
    setPartido({ ...partido, asientos });
    guardarAsientos(asientos);
  };

  if (loading) return <p className="text-center text-slate-400 py-10">Cargando…</p>;
  if (!partido)
    return (
      <div className="text-center py-10">
        <p className="text-slate-500 mb-3">Partido no encontrado.</p>
        <Link to="/admin" className="text-betis-green hover:underline">Volver al panel</Link>
      </div>
    );

  const fecha = format(parseISO(partido.fecha), "d MMM yyyy", { locale: es });
  const baseAsiento = (a: Asiento) => base.find((b) => b.id === a.id) || a;

  return (
    <section>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <Link to="/admin" className="text-sm text-betis-green hover:underline">← Panel</Link>
          <h1 className="text-2xl font-bold text-slate-800 mt-1">
            Editar bus · {fecha} vs {partido.rival}
          </h1>
          <p className="text-sm text-slate-500">Clic en un asiento para editarlo. Los cambios se guardan automáticamente.</p>
        </div>
        <Legend />
      </div>

      <div className="flex items-center gap-3 mb-4 h-6">
        {saving && (
          <span className="text-sm text-slate-400 flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 border-2 border-slate-200 border-t-betis-green rounded-full animate-spin" />
            Guardando…
          </span>
        )}
        {savedMsg && !saving && (
          <span className="text-sm text-betis-green font-medium">{savedMsg}</span>
        )}
      </div>

      <BusMap
        asientos={partido.asientos}
        clickable
        onSeatClick={(a) => setSelected(a)}
      />

      {selected && (
        <SeatEditModal
          asiento={selected}
          baseAsiento={baseAsiento(selected)}
          onClose={() => setSelected(null)}
          onApply={(next) => {
            applyChange(next);
            setSelected(null);
          }}
        />
      )}
    </section>
  );
}
