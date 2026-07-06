import type { Asiento } from "../../types";
import { SteeringIcon, MicIcon } from "../ui/Icons";

interface Props {
  asientos: Asiento[];
  onSeatClick?: (a: Asiento) => void;
  clickable?: boolean;
}

export default function SeatFrontal({ asientos, onSeatClick, clickable }: Props) {
  const chofer = asientos.find((a) => a.estado === "Conductor");
  const guia = asientos.find((a) => a.estado === "Guia");

  return (
    <div className="bus-frontal">
      {/* Izquierda-Ventana: Chófer */}
      {chofer ? (
        <button
          type="button"
          disabled={!clickable}
          onClick={() => clickable && onSeatClick?.(chofer)}
          className={`frontal-card seat-conductor ${clickable ? "frontal-card-clickable" : ""}`}
          title="Conductor"
        >
          <SteeringIcon size={16} />
          <span className="frontal-label">CHÓFER</span>
        </button>
      ) : (
        <div />
      )}

      {/* Izquierda-Pasillo: libre */}
      <div />

      {/* Pasillo central */}
      <div className="pasillo" />

      {/* Derecha-Pasillo: libre */}
      <div />

      {/* Derecha-Ventana: Guía */}
      {guia ? (
        <button
          type="button"
          disabled={!clickable}
          onClick={() => clickable && onSeatClick?.(guia)}
          className={`frontal-card seat-guia ${clickable ? "frontal-card-clickable" : ""}`}
          title="Guía"
        >
          <MicIcon size={16} />
          <span className="frontal-label">GUÍA</span>
        </button>
      ) : (
        <div />
      )}
    </div>
  );
}
