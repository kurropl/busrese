-- ============================================================
-- Peña Bética Cultural El Arco Rafael Villa — Autobús 26/27
-- Migración inicial (Supabase / PostgreSQL)
-- ============================================================

-- Plantilla por defecto (singleton: una sola fila, id fijo)
CREATE TABLE IF NOT EXISTS configuracion_base (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asientos    JSONB NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Instancias individuales (un partido = un partido del Betis)
CREATE TABLE IF NOT EXISTS partidos (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha       DATE NOT NULL,
    rival       VARCHAR(255) NOT NULL,
    competicion VARCHAR(100) DEFAULT 'LaLiga',
    localidad   VARCHAR(50)  DEFAULT 'Local',
    asientos    JSONB NOT NULL,
    activo      BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partidos_fecha ON partidos (fecha);

-- updated_at automático
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_partidos_updated ON partidos;
CREATE TRIGGER trg_partidos_updated BEFORE UPDATE ON partidos
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_config_updated ON configuracion_base;
CREATE TRIGGER trg_config_updated BEFORE UPDATE ON configuracion_base
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- RLS: lectura pública, escritura solo admin (authenticated)
-- ============================================================
ALTER TABLE configuracion_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE partidos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_config" ON configuracion_base;
CREATE POLICY "public_read_config" ON configuracion_base FOR SELECT USING (true);

DROP POLICY IF EXISTS "admin_write_config" ON configuracion_base;
CREATE POLICY "admin_write_config" ON configuracion_base
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_read_partidos" ON partidos;
CREATE POLICY "public_read_partidos" ON partidos FOR SELECT USING (true);

DROP POLICY IF EXISTS "admin_write_partidos" ON partidos;
CREATE POLICY "admin_write_partidos" ON partidos
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Confirmación pública: cualquier usuario puede actualizar el campo
-- 'confirmado' dentro del JSONB asientos (los socios confirman sin login).
-- Solo se permite UPDATE, no INSERT/DELETE.
DROP POLICY IF EXISTS "public_confirm_partidos" ON partidos;
CREATE POLICY "public_confirm_partidos" ON partidos
    FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- Seed: configuracion_base con la Matriz B (78 plazas).
-- El array JSONB se inserta desde el frontend (clonarMatrizB) o vía
-- script de seed. Aquí dejamos la fila singleton vacía lista para
-- ser rellenada desde el panel admin (botón "Restaurar base").
-- ============================================================
INSERT INTO configuracion_base (id, asientos)
SELECT '00000000-0000-0000-0000-000000000000', '[]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM configuracion_base);
