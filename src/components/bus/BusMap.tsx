import type { Asiento } from "../../types";
import SeatFrontal from "./SeatFrontal";
import SeatRow from "./SeatRow";

interface Props {
  asientos: Asiento[];
  onSeatClick?: (a: Asiento) => void;
  clickable?: boolean;
  horaPartido?: string | null;
  horaSalidaBus?: string | null;
}

export default function BusMap({ asientos, onSeatClick, clickable, horaPartido, horaSalidaBus }: Props) {
  const frontal = asientos.filter((a) => a.zona === "Frontal");
  const cuerpo = asientos.filter((a) => a.zona === "Cuerpo");
  const filas = Array.from(new Set(cuerpo.map((a) => a.fila))).sort((a, b) => a - b);

  return (
    <div className="bus-shell">
      {/* Ventanas superiores */}
      <div className="bus-windows" />

      {/* Marca + horas */}
      <div className="bus-brand flex items-center justify-between px-4">
        <span>Peña Bética · El Arco</span>
        {(horaPartido || horaSalidaBus) && (
          <span className="flex gap-3 text-[11px] font-semibold">
            {horaSalidaBus && (
              <span className="text-emerald-300">Salida {horaSalidaBus}</span>
            )}
            {horaPartido && (
              <span className="text-amber-200">Partido {horaPartido}</span>
            )}
          </span>
        )}
      </div>

      <div className="bus-interior">
        {/* Etiqueta Delante */}
        <div className="bus-label mb-2">▲ Delante</div>

        {/* Parabrisas */}
        <div className="bus-parabrisas" />

        {/* Frontal: chófer y guía */}
        <SeatFrontal asientos={frontal} onSeatClick={onSeatClick} clickable={clickable} />

        {/* Cuerpo: 15 filas x 4 asientos con pasillo central */}
        <div className="bus-grid">
          {filas.map((f) => {
            const rowSeats = cuerpo
              .filter((a) => a.fila === f)
              .sort((a, b) => (a.numero ?? 0) - (b.numero ?? 0));
            return (
              <SeatRow
                key={f}
                fila={f}
                asientos={rowSeats}
                onSeatClick={onSeatClick}
                clickable={clickable}
              />
            );
          })}
        </div>

        {/* Fondo del bus */}
        <div className="bus-fondo" />

        {/* Etiqueta Detrás */}
        <div className="bus-label mt-2">▼ Detrás</div>
      </div>
    </div>
  );
}
