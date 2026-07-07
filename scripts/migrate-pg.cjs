// Ejecuta la migración SQL via el pooler de Supabase (puerto 6543)
const { Client } = require("pg");
const fs = require("fs");

const sql = fs.readFileSync("supabase/migrations/0001_init.sql", "utf-8");

const client = new Client({
  host: "aws-0-eu-central-1.pooler.supabase.com",
  port: 6543,
  database: "postgres",
  user: "postgres.pyledmtcljkjdbmuaakm",
  password: "yrUFpYrv65DMID08",
  ssl: { rejectUnauthorized: false },
});

async function run() {
  try {
    await client.connect();
    console.log("Conectado a Supabase via pooler");

    await client.query(sql);
    console.log("Migración ejecutada correctamente");

    // Verificar
    const res = await client.query("SELECT count(*) FROM partidos");
    console.log("Partidos en la tabla:", res.rows[0].count);

    const res2 = await client.query("SELECT count(*) FROM configuracion_base");
    console.log("Config base:", res2.rows[0].count);
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await client.end();
  }
}

run();
