import type { Asiento } from "../types";

// Matriz B — 62 plazas totales: Chófer + Guía + 60 pasajeros (15 filas x 4).
// Sin asientos libres extra en el frontal. Sin filas 16-18.

const nombresFilas: string[][] = [
  // Fila 1-15 (índice 0-14), 4 ocupantes por fila
  // Orden: [VentanaIzq, PasilloIzq, PasilloDer, VentanaDer]
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

const posLeft = ["Ventana", "Pasillo"] as const;
const posRight = ["Pasillo", "Ventana"] as const;

function cuerpo(): Asiento[] {
  const seats: Asiento[] = [];
  for (let fila = 1; fila <= 15; fila++) {
    for (let col = 0; col < 4; col++) {
      const numero = (fila - 1) * 4 + col + 1;
      const lado = col < 2 ? "Izquierda" : "Derecha";
      const idxSide = col % 2;
      const posicion = lado === "Izquierda" ? posLeft[idxSide] : posRight[idxSide];
      seats.push({
        id: String(numero),
        numero,
        zona: "Cuerpo",
        fila,
        lado,
        posicion,
        estado: "Ocupado",
        ocupante: nombresFilas[fila - 1][col],
      });
    }
  }
  return seats;
}

function frontal(): Asiento[] {
  return [
    { id: "F-CHOFER", numero: null, zona: "Frontal", fila: 0, lado: "Izquierda", posicion: "Ventana", estado: "Conductor", ocupante: "CHÓFER" },
    { id: "F-GUIA", numero: null, zona: "Frontal", fila: 0, lado: "Derecha", posicion: "Ventana", estado: "Guia", ocupante: "GUÍA" },
  ];
}

export const matrizB: Asiento[] = [...frontal(), ...cuerpo()];

export function clonarMatrizB(): Asiento[] {
  return matrizB.map((a) => ({ ...a, ocupante: a.ocupante ? String(a.ocupante) : null }));
}
