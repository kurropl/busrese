import { supabase, supabaseEnabled } from "./supabase";
import { clonarMatrizB } from "../data/matrizB";
import calendario from "../data/calendario.json";
import type { Asiento, Confirmacion, Partido, PartidoInput } from "../types";

const LS_KEY = "pena-betica-partidos";
const LS_SEEDED = "pena-betica-seeded";

/* ----------------------------- Local fallback ----------------------------- */

function lsRead(): Partido[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}
function lsWrite(list: Partido[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}
function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

/* ------------------------------- Public API ------------------------------- */

/** Carga los 38 partidos del calendario 26/27 si la BD está vacía. */
export async function seedIfEmpty(): Promise<void> {
  const existing = await getPartidos();
  if (existing.length > 0) return;

  if (supabaseEnabled && supabase) {
    const inserts = calendario.map((p) => ({
      fecha: p.fecha,
      rival: p.rival,
      competicion: "LaLiga EA Sports",
      localidad: p.localidad,
      asientos: clonarMatrizB(),
      activo: false,
    }));
    const { error } = await supabase.from("partidos").insert(inserts);
    if (error) throw error;
    return;
  }

  // Local: insertar 38 partidos
  const list: Partido[] = calendario.map((p) => ({
    id: uid(),
    fecha: p.fecha,
    rival: p.rival,
    competicion: "LaLiga EA Sports",
    localidad: p.localidad as "Local" | "Visitante",
    asientos: clonarMatrizB(),
    activo: false,
    created_at: new Date().toISOString(),
  }));
  lsWrite(list);
  localStorage.setItem(LS_SEEDED, "1");
}

export async function getPartidos(): Promise<Partido[]> {
  if (supabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("partidos")
      .select("*")
      .order("fecha", { ascending: true });
    if (error) throw error;
    return (data || []) as Partido[];
  }
  return lsRead().sort((a, b) => a.fecha.localeCompare(b.fecha));
}

export async function getPartido(id: string): Promise<Partido | null> {
  if (supabaseEnabled && supabase) {
    const { data, error } = await supabase.from("partidos").select("*").eq("id", id).single();
    if (error) throw error;
    return data as Partido;
  }
  return lsRead().find((p) => p.id === id) || null;
}

export async function createPartido(input: PartidoInput): Promise<Partido> {
  const asientos = clonarMatrizB();
  if (supabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("partidos")
      .insert({ ...input, asientos, activo: false })
      .select()
      .single();
    if (error) throw error;
    return data as Partido;
  }
  const partido: Partido = {
    id: uid(),
    ...input,
    asientos,
    activo: false,
    created_at: new Date().toISOString(),
  };
  const list = lsRead();
  list.push(partido);
  lsWrite(list);
  return partido;
}

export async function updatePartidoAsientos(id: string, asientos: Asiento[]): Promise<void> {
  if (supabaseEnabled && supabase) {
    const { error } = await supabase
      .from("partidos")
      .update({ asientos, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
    return;
  }
  const list = lsRead();
  const idx = list.findIndex((p) => p.id === id);
  if (idx >= 0) {
    list[idx].asientos = asientos;
    list[idx].updated_at = new Date().toISOString();
    lsWrite(list);
  }
}

export async function deletePartido(id: string): Promise<void> {
  if (supabaseEnabled && supabase) {
    const { error } = await supabase.from("partidos").delete().eq("id", id);
    if (error) throw error;
    return;
  }
  lsWrite(lsRead().filter((p) => p.id !== id));
}

/** Publica / despublica un partido. Al publicar, se fijan fecha, hora y hora de salida. */
export async function togglePublicarPartido(
  id: string,
  activo: boolean,
  datos?: { fecha?: string; hora_partido?: string; hora_salida_bus?: string }
): Promise<void> {
  if (supabaseEnabled && supabase) {
    const patch: Record<string, unknown> = {
      activo,
      updated_at: new Date().toISOString(),
    };
    if (datos?.fecha) patch.fecha = datos.fecha;
    if (datos?.hora_partido !== undefined) patch.hora_partido = datos.hora_partido || null;
    if (datos?.hora_salida_bus !== undefined) patch.hora_salida_bus = datos.hora_salida_bus || null;
    const { error } = await supabase.from("partidos").update(patch).eq("id", id);
    if (error) throw error;
    return;
  }
  const list = lsRead();
  const idx = list.findIndex((p) => p.id === id);
  if (idx >= 0) {
    list[idx].activo = activo;
    if (datos?.fecha) list[idx].fecha = datos.fecha;
    if (datos?.hora_partido !== undefined) list[idx].hora_partido = datos.hora_partido || null;
    if (datos?.hora_salida_bus !== undefined) list[idx].hora_salida_bus = datos.hora_salida_bus || null;
    list[idx].updated_at = new Date().toISOString();
    lsWrite(list);
  }
}

/** Devuelve la configuración base (Matriz B) para la acción "Restaurar". */
export function getConfigBase(): Asiento[] {
  return clonarMatrizB();
}

/** Actualiza el estado de confirmación de un asiento concreto (uso público, sin auth). */
export async function confirmarAsiento(partidoId: string, asientoId: string, confirmacion: Confirmacion): Promise<void> {
  if (supabaseEnabled && supabase) {
    // Supabase: leer partido, modificar asiento, guardar
    const { data, error: errFetch } = await supabase
      .from("partidos")
      .select("asientos")
      .eq("id", partidoId)
      .single();
    if (errFetch) throw errFetch;
    const asientos = (data?.asientos as Asiento[]).map((a) =>
      a.id === asientoId ? { ...a, confirmado: confirmacion } : a
    );
    const { error } = await supabase
      .from("partidos")
      .update({ asientos, updated_at: new Date().toISOString() })
      .eq("id", partidoId);
    if (error) throw error;
    return;
  }
  const list = lsRead();
  const idx = list.findIndex((p) => p.id === partidoId);
  if (idx >= 0) {
    list[idx].asientos = list[idx].asientos.map((a) =>
      a.id === asientoId ? { ...a, confirmado: confirmacion } : a
    );
    list[idx].updated_at = new Date().toISOString();
    lsWrite(list);
  }
}
