// Script temporal: ejecuta la migración SQL via TCP usando el módulo net de Node
// Conexión directa a PostgreSQL usando el protocolo wire

const net = require("net");

const HOST = "db.pyledmtcljkjdbmuaakm.supabase.co";
const PORT = 5432;
const USER = "postgres";
const PASSWORD = "yrUFpYrv65DMID08";
const DB = "postgres";

const fs = require("fs");
const sql = fs.readFileSync("supabase/migrations/0001_init.sql", "utf-8");

// Protocolo PostgreSQL simplificado: StartupMessage -> Auth -> Query -> Close
// En lugar de implementar el protocolo completo, usamos el endpoint REST de Supabase
// con la service_role key... pero no la tenemos.

// Alternativa: usar el endpoint de PostgREST con la anon key
// El problema es que la key Sb_publishable_... no funciona con la API v1.

// Vamos a probar si la key funciona con el header "X-Client-Info"
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://pyledmtcljkjdbmuaakm.supabase.co";
const supabaseKey = "Sb_publishable_Ok3WRX3ScNfJo2OObhK2MA_Hk0yAIdP";

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

async function run() {
  // Primero verificar si la tabla partidos existe
  const { data, error } = await supabase.from("partidos").select("id").limit(1);

  if (error) {
    console.log("Error al leer partidos:", error.message);
    console.log("La tabla no existe o la key no funciona. Hay que ejecutar la migración SQL manualmente.");
    console.log("\nEjecuta este SQL en el SQL Editor de Supabase:");
    console.log("=============================================");
    console.log(sql);
    console.log("=============================================");
    process.exit(1);
  }

  console.log("Conexión OK. Tabla partidos existe. Filas:", data.length);

  // Si no hay partidos, hacer seed
  if (data.length === 0) {
    console.log("No hay partidos. Haciendo seed...");
    // El seed lo hará el frontend automáticamente al entrar al dashboard
    console.log("El seed se ejecutará automáticamente al abrir la app.");
  }

  process.exit(0);
}

run();
