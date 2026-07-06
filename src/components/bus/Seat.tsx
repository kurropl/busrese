import type { Asiento } from "../../types";
import { TicketIcon, UserIcon, CheckIcon, XIcon } from "../ui/Icons";

interface Props {
  asiento: Asiento;
  onClick?: (a: Asiento) => void;
  clickable?: boolean;
  selected?: boolean;
}

const estadoCls: Record<Asiento["estado"], string> = {
  Libre: "seat-libre",
  Ocupado: "seat-ocupado",
  Conductor: "seat-conductor",
  Guia: "seat-guia",
};

export default function Seat({ asiento, onClick, clickable, selected }: Props) {
  const isFrontal = asiento.estado === "Conductor" || asiento.estado === "Guia";

  // No renderizar asientos frontales aquí (los pinta SeatFrontal)
  if (isFrontal) return null;

  const label = String(asiento.numero);
  const isFree = asiento.estado === "Libre";
  const name = isFree ? "Libre" : asiento.ocupante;

  // Clase de confirmación (solo para asientos Ocupados)
  const confirmacionCls =
    asiento.estado === "Ocupado" && asiento.confirmado === "confirmado"
      ? "seat-confirmado"
      : asiento.estado === "Ocupado" && asiento.confirmado === "cancelado"
        ? "seat-cancelado"
        : "";

  return (
    <button
      type="button"
      disabled={!clickable}
      onClick={() => clickable && onClick?.(asiento)}
      className={`seat ${estadoCls[asiento.estado]} ${confirmacionCls} ${clickable ? "seat-clickable" : ""} ${selected ? "seat-selected" : ""}`}
      title={asiento.ocupante ? `Asiento ${asiento.numero} · ${asiento.ocupante}` : `Asiento ${asiento.numero}`}
    >
      <span className="seat-num">{label}</span>
      {name && <span className="seat-name">{name}</span>}
      {/* Icono según estado de confirmación */}
      {asiento.confirmado === "confirmado" ? (
        <CheckIcon className="seat-icon" size={11} />
      ) : asiento.confirmado === "cancelado" ? (
        <XIcon className="seat-icon" size={11} />
      ) : isFree ? (
        <UserIcon className="seat-icon" size={11} />
      ) : (
        <TicketIcon className="seat-icon" size={11} />
      )}
    </button>
  );
}
