import type { Asiento } from "../../types";
import SeatFrontal from "./SeatFrontal";
import SeatRow from "./SeatRow";

interface Props {
  asientos: Asiento[];
  onSeatClick?: (a: Asiento) => void;
  clickable?: boolean;
}

export default function BusMap({ asientos, onSeatClick, clickable }: Props) {
  const frontal = asientos.filter((a) => a.zona === "Frontal");
  const cuerpo = asientos.filter((a) => a.zona === "Cuerpo");
  const filas = Array.from(new Set(cuerpo.map((a) => a.fila))).sort((a, b) => a - b);

  return (
    <div className="bus-shell">
      {/* Línea de ventanas */}
      <div className="bus-windows" />

      <div className="bus-interior">
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
      </div>
    </div>
  );
}
