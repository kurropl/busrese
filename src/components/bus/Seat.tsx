import type { Asiento } from "../../types";

interface Props {
  asiento: Asiento;
  onClick?: (a: Asiento) => void;
  clickable?: boolean;
}

const estadoCls: Record<Asiento["estado"], string> = {
  Libre: "seat-libre",
  Ocupado: "seat-ocupado",
  Conductor: "seat-conductor",
  Guia: "seat-guia",
};

export default function Seat({ asiento, onClick, clickable }: Props) {
  const label =
    asiento.estado === "Conductor" || asiento.estado === "Guia"
      ? asiento.ocupante || asiento.estado
      : asiento.numero != null
      ? String(asiento.numero)
      : asiento.id;

  const name = asiento.ocupante && asiento.estado !== "Conductor" && asiento.estado !== "Guia"
    ? asiento.ocupante
    : asiento.estado === "Libre"
    ? "Libre"
    : asiento.ocupante;

  return (
    <button
      type="button"
      disabled={!clickable}
      onClick={() => clickable && onClick?.(asiento)}
      className={`seat ${estadoCls[asiento.estado]} ${clickable ? "seat-clickable" : ""}`}
      title={asiento.ocupante ? `${label} · ${asiento.ocupante}` : label}
    >
      <span className="opacity-80">{label}</span>
      {name && name !== label && (
        <span className="truncate max-w-full px-0.5">{name}</span>
      )}
    </button>
  );
}
