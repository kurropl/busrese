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
    <div className="w-full max-w-md mx-auto bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      {/* Parabrisas */}
      <div className="mx-auto mb-3 h-2 w-3/4 rounded-full bg-gray-200" />

      <SeatFrontal asientos={frontal} onSeatClick={onSeatClick} clickable={clickable} />

      <div className="border-t border-dashed border-gray-200 my-2" />

      {/* Cuerpo: grid de 6 columnas (num | lw | la | pasillo | ra | rw) */}
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: "1.2rem 1fr 1fr 0.7fr 1fr 1fr" }}
      >
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

      <div className="border-t border-dashed border-gray-200 my-2" />
      {/* Fondo */}
      <div className="mx-auto h-2 w-3/4 rounded-full bg-gray-200" />
    </div>
  );
}
