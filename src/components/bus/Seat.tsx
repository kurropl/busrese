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
  const isFrontal = asiento.estado === "Conductor" || asiento.estado === "Guia";
  const label = isFrontal
    ? asiento.ocupante || asiento.estado
    : String(asiento.numero);

  const name =
    asiento.estado === "Libre"
      ? "Libre"
      : asiento.ocupante && !isFrontal
      ? asiento.ocupante
      : null;

  return (
    <button
      type="button"
      disabled={!clickable}
      onClick={() => clickable && onClick?.(asiento)}
      className={`seat ${estadoCls[asiento.estado]} ${clickable ? "seat-clickable" : ""}`}
      title={asiento.ocupante ? `${label} · ${asiento.ocupante}` : label}
    >
      <span className="text-[9px] opacity-60">{label}</span>
      {name && (
        <span className="truncate max-w-full px-0.5 text-[8px] sm:text-[9px]">{name}</span>
      )}
    </button>
  );
}
