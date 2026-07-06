import type { Asiento } from "../../types";
import Seat from "./Seat";

interface Props {
  asientos: Asiento[]; // 6 plazas frontales
  onSeatClick?: (a: Asiento) => void;
  clickable?: boolean;
}

export default function SeatFrontal({ asientos, onSeatClick, clickable }: Props) {
  const izq = asientos.filter((a) => a.lado === "Izquierda");
  const der = asientos.filter((a) => a.lado === "Derecha");
  return (
    <div className="mb-2">
      <div className="text-center text-[10px] text-gray-400 mb-1">Frontal</div>
      <div className="bus-grid">
        <div className="col-span-1 flex flex-col gap-1">
          {izq.map((a) => (
            <Seat key={a.id} asiento={a} onClick={onSeatClick} clickable={clickable} />
          ))}
        </div>
        <div className="pasillo">·</div>
        <div className="col-span-1 flex flex-col gap-1">
          {der.map((a) => (
            <Seat key={a.id} asiento={a} onClick={onSeatClick} clickable={clickable} />
          ))}
        </div>
      </div>
    </div>
  );
}
