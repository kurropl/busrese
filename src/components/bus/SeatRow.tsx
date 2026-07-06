import type { Asiento } from "../../types";
import Seat from "./Seat";

interface Props {
  fila: number;
  asientos: Asiento[]; // 4: [ventanaIzq, pasilloIzq, pasilloDer, ventanaDer]
  onSeatClick?: (a: Asiento) => void;
  clickable?: boolean;
}

export default function SeatRow({ fila, asientos, onSeatClick, clickable }: Props) {
  const [vIzq, pIzq, pDer, vDer] = asientos;
  return (
    <>
      {/* Número de fila a la izquierda */}
      <Seat asiento={vIzq} onClick={onSeatClick} clickable={clickable} />
      <Seat asiento={pIzq} onClick={onSeatClick} clickable={clickable} />
      <div className="pasillo" />
      <Seat asiento={pDer} onClick={onSeatClick} clickable={clickable} />
      <Seat asiento={vDer} onClick={onSeatClick} clickable={clickable} />
    </>
  );
}
