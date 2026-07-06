import type { Asiento } from "../../types";

interface Props {
  asientos: Asiento[]; // 2 plazas: chófer (izq) y guía (der)
  onSeatClick?: (a: Asiento) => void;
  clickable?: boolean;
}

export default function SeatFrontal({ asientos, onSeatClick, clickable }: Props) {
  const chofer = asientos.find((a) => a.estado === "Conductor");
  const guia = asientos.find((a) => a.estado === "Guia");

  return (
    <div className="bus-frontal">
      {chofer && (
        <button
          type="button"
          disabled={!clickable}
          onClick={() => clickable && onSeatClick?.(chofer)}
          className={`frontal-seat seat-conductor ${clickable ? "seat-clickable" : ""}`}
          title="Conductor"
        >
          <span className="text-base mb-0.5">🚌</span>
          <span>CHÓFER</span>
        </button>
      )}
      {guia && (
        <button
          type="button"
          disabled={!clickable}
          onClick={() => clickable && onSeatClick?.(guia)}
          className={`frontal-seat seat-guia ${clickable ? "seat-clickable" : ""}`}
          title="Guía"
        >
          <span className="text-base mb-0.5">📋</span>
          <span>GUÍA</span>
        </button>
      )}
    </div>
  );
}
