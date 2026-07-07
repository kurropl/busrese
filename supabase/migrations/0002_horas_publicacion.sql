-- ============================================================
-- Migración 0002: Campos de publicación (hora partido + hora bus)
-- ============================================================
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query

ALTER TABLE partidos ADD COLUMN IF NOT EXISTS hora_partido     VARCHAR(5);
ALTER TABLE partidos ADD COLUMN IF NOT EXISTS hora_salida_bus  VARCHAR(5);

-- Comentario descriptivo
COMMENT ON COLUMN partidos.hora_partido IS 'Hora exacta del partido (HH:MM), se establece al publicar';
COMMENT ON COLUMN partidos.hora_salida_bus IS 'Hora de salida del autobús (HH:MM), se establece al publicar';
