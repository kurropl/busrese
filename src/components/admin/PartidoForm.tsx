import { useState } from "react";
import type { PartidoInput } from "../../types";

interface Props {
  onCreate: (input: PartidoInput) => Promise<void>;
}

export default function PartidoForm({ onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [fecha, setFecha] = useState("");
  const [rival, setRival] = useState("");
  const [competicion, setCompeticion] = useState("LaLiga");
  const [localidad, setLocalidad] = useState<"Local" | "Visitante">("Local");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const reset = () => {
    setFecha("");
    setRival("");
    setCompeticion("LaLiga");
    setLocalidad("Local");
    setErr("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await onCreate({ fecha, rival, competicion, localidad });
      reset();
      setOpen(false);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error al crear partido");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="bg-betis-green text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-betis-dark"
      >
        {open ? "Cancelar" : "+ Nuevo partido"}
      </button>

      {open && (
        <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Rival</label>
            <input
              value={rival}
              onChange={(e) => setRival(e.target.value)}
              required
              placeholder="Sevilla FC"
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Competición</label>
            <input
              value={competicion}
              onChange={(e) => setCompeticion(e.target.value)}
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Localidad</label>
            <select
              value={localidad}
              onChange={(e) => setLocalidad(e.target.value as "Local" | "Visitante")}
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            >
              <option>Local</option>
              <option>Visitante</option>
            </select>
          </div>
          {err && <p className="text-sm text-red-500 sm:col-span-2">{err}</p>}
          <button
            type="submit"
            disabled={busy}
            className="sm:col-span-2 bg-betis-dark text-white rounded py-2 text-sm font-medium hover:bg-betis-green disabled:opacity-50"
          >
            {busy ? "Creando (clonando Matriz B)…" : "Crear partido"}
          </button>
        </form>
      )}
    </div>
  );
}
