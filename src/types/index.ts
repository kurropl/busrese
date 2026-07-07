export type EstadoAsiento = "Libre" | "Ocupado" | "Conductor" | "Guia";
export type Confirmacion = "pendiente" | "confirmado" | "cancelado";

export interface Asiento {
  id: string; // "F-I1" (frontal) | "1".."72" (cuerpo)
  numero: number | null; // null en frontal, 1-72 en cuerpo
  zona: "Frontal" | "Cuerpo";
  fila: number; // 0 = frontal, 1-18 = cuerpo
  lado: "Izquierda" | "Derecha";
  posicion: "Ventana" | "Pasillo" | "Centro";
  estado: EstadoAsiento;
  ocupante: string | null;
  confirmado?: Confirmacion; // pendiente | confirmado | cancelado
}

export interface Partido {
  id: string;
  fecha: string; // ISO date (orientativa hasta publicar)
  rival: string;
  competicion: string;
  localidad: "Local" | "Visitante";
  asientos: Asiento[];
  activo: boolean;
  hora_partido?: string | null; // "HH:MM" — se establece al publicar
  hora_salida_bus?: string | null; // "HH:MM" — se establece al publicar
  created_at?: string;
  updated_at?: string;
}

export type PartidoInput = Omit<Partido, "id" | "asientos" | "activo" | "created_at" | "updated_at" | "hora_partido" | "hora_salida_bus">;
