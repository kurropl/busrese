import { useEffect, useState } from "react";
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
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setBase(getConfigBase());
    if (!id) return;
    getPartido(id)
      .then(setPartido)
      .finally(() => setLoading(false));
  }, [id]);

  const applyChange = (next: Asiento) => {
    if (!partido) return;
    const asientos = partido.asientos.map((a) => (a.id === next.id ? next : a));
    setPartido({ ...partido, asientos });
    setSaved(false);
  };

  const guardar = async () => {
    if (!partido || !id) return;
    setSaving(true);
    try {
      await updatePartidoAsientos(id, partido.asientos);
      setSaved(true);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500 py-10">Cargando…</p>;
  if (!partido)
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-3">Partido no encontrado.</p>
        <Link to="/admin" className="text-betis-green hover:underline">Volver al panel</Link>
      </div>
    );

  const fecha = format(parseISO(partido.fecha), "d MMM yyyy", { locale: es });
  const baseAsiento = (a: Asiento) => base.find((b) => b.id === a.id) || a;

  return (
    <section>
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div>
          <Link to="/admin" className="text-sm text-betis-green hover:underline">← Panel</Link>
          <h1 className="text-2xl font-bold text-betis-dark">
            Editar bus · {fecha} vs {partido.rival}
          </h1>
          <p className="text-sm text-gray-500">Clic en un asiento para editarlo.</p>
        </div>
        <Legend />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={guardar}
          disabled={saving}
          className="bg-betis-green text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-betis-dark disabled:opacity-50"
        >
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
        {saved && <span className="text-sm text-betis-green">Cambios guardados.</span>}
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
