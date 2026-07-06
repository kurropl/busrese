import type { Asiento } from "../types";

// Matriz B — Asignación obligatoria por defecto (78 plazas).
// Frontal: 6 plazas (CHÓFER + GUÍA + 4 libres). Cuerpo: 72 plazas (filas 1-18).

const nombresFilas: string[][] = [
  // Fila 1-15 (índice 0-14), 4 ocupantes por fila
  ["Curro Villa", "Rafael Román", "Luis Torres", "Maite Villa"],
  ["Pepe Ruiz", "Luis Ruiz", "Ramón Calero", "Juan Calero"],
  ["Antonio Ruiz", "María Ruiz", "Vilches", "Laura"],
  ["Luis Ruiz Hijo", "Inma", "Ruperto Ruiz", "Juanma"],
  ["Nely", "Marco", "Manolo Ruiz", "Reyes Ruiz"],
  ["Manolo", "Pedro Jesús", "Luis Mateo", "Mª Luisa"],
  ["Antonio Ceballos H.", "Macarena", "Pepe", "Mª José"],
  ["Antonio Ceballos H.", "Migue Lora", "Curro Barrera", "Ale Muñoz"],
  ["Javier Pardo", "José Venegas", "Pedro Gaviño", "Manolo Curado"],
  ["Manuel Jiménez", "Javier Jiménez", "Angela Madrigal", "José Lunar"],
  ["Luis", "Daniel", "Juan José", "Francis"],
  ["José Carlos", "Javier Anarte", "José Carlos", "Rubén"],
  ["Hugo Cabra", "Alejandro Díaz", "Joaquín", "J.A. Rull"],
  ["Infantil 2", "Infantil 3", "Monitor", "Infantil 1"],
  ["Infantil 6", "Infantil 7", "Infantil 4", "Infantil 5"],
];

// Posición dentro de cada lado: izquierda [Ventana, Pasillo], derecha [Pasillo, Ventana]
const posLeft = ["Ventana", "Pasillo"] as const;
const posRight = ["Pasillo", "Ventana"] as const;

function cuerpo(): Asiento[] {
  const seats: Asiento[] = [];
  for (let fila = 1; fila <= 18; fila++) {
    for (let col = 0; col < 4; col++) {
      const numero = (fila - 1) * 4 + col + 1;
      const lado = col < 2 ? "Izquierda" : "Derecha";
      const idxSide = col % 2;
      const posicion = lado === "Izquierda" ? posLeft[idxSide] : posRight[idxSide];
      let estado: Asiento["estado"] = "Libre";
      let ocupante: string | null = null;
      if (fila <= 15) {
        estado = "Ocupado";
        ocupante = nombresFilas[fila - 1][col];
      }
      seats.push({
        id: String(numero),
        numero,
        zona: "Cuerpo",
        fila,
        lado,
        posicion,
        estado,
        ocupante,
      });
    }
  }
  return seats;
}

function frontal(): Asiento[] {
  return [
    { id: "F-I1", numero: null, zona: "Frontal", fila: 0, lado: "Izquierda", posicion: "Ventana", estado: "Conductor", ocupante: "CHÓFER" },
    { id: "F-I2", numero: null, zona: "Frontal", fila: 0, lado: "Izquierda", posicion: "Pasillo", estado: "Libre", ocupante: null },
    { id: "F-I3", numero: null, zona: "Frontal", fila: 0, lado: "Izquierda", posicion: "Centro", estado: "Libre", ocupante: null },
    { id: "F-D1", numero: null, zona: "Frontal", fila: 0, lado: "Derecha", posicion: "Pasillo", estado: "Guia", ocupante: "GUÍA" },
    { id: "F-D2", numero: null, zona: "Frontal", fila: 0, lado: "Derecha", posicion: "Centro", estado: "Libre", ocupante: null },
    { id: "F-D3", numero: null, zona: "Frontal", fila: 0, lado: "Derecha", posicion: "Ventana", estado: "Libre", ocupante: null },
  ];
}

export const matrizB: Asiento[] = [...frontal(), ...cuerpo()];

export function clonarMatrizB(): Asiento[] {
  return matrizB.map((a) => ({ ...a, ocupante: a.ocupante ? String(a.ocupante) : null }));
}
