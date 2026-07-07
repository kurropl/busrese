// Seed: inserta los 38 partidos del calendario 26/27 con la Matriz B
const { Client } = require("pg");
const fs = require("fs");

const client = new Client({
  host: "aws-0-eu-central-1.pooler.supabase.com",
  port: 6543,
  database: "postgres",
  user: "postgres.pyledmtcljkjdbmuaakm",
  password: "yrUFpYrv65DMID08",
  ssl: { rejectUnauthorized: false },
});

// Cargar el calendario
const calendario = JSON.parse(fs.readFileSync("src/data/calendario.json", "utf-8"));

// Cargar la Matriz B (generar el array de asientos)
// Replicamos la lógica de matrizB.ts
const nombresFilas = [
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

function generarAsientos() {
  const asientos = [];

  // Frontal: Chófer y Guía
  asientos.push({ id: "F-CHOFER", numero: null, zona: "Frontal", fila: 0, lado: "Izquierda", posicion: "Ventana", estado: "Conductor", ocupante: "CHÓFER" });
  asientos.push({ id: "F-GUIA", numero: null, zona: "Frontal", fila: 0, lado: "Derecha", posicion: "Ventana", estado: "Guia", ocupante: "GUÍA" });

  // Cuerpo: 15 filas x 4 asientos
  const posLeft = ["Ventana", "Pasillo"];
  const posRight = ["Pasillo", "Ventana"];
  for (let fila = 1; fila <= 15; fila++) {
    for (let col = 0; col < 4; col++) {
      const numero = (fila - 1) * 4 + col + 1;
      const lado = col < 2 ? "Izquierda" : "Derecha";
      const idxSide = col % 2;
      const posicion = lado === "Izquierda" ? posLeft[idxSide] : posRight[idxSide];
      asientos.push({
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
  return asientos;
}

async function run() {
  await client.connect();
  console.log("Conectado. Generando seed...");

  const asientos = generarAsientos();
  console.log(`Asientos por partido: ${asientos.length}`);

  // Verificar si ya hay partidos
  const check = await client.query("SELECT count(*) FROM partidos");
  if (parseInt(check.rows[0].count) > 0) {
    console.log(`Ya hay ${check.rows[0].count} partidos. Saltando seed.`);
    await client.end();
    return;
  }

  // Insertar 38 partidos
  for (const p of calendario) {
    await client.query(
      `INSERT INTO partidos (fecha, rival, competicion, localidad, asientos, activo)
       VALUES ($1, $2, $3, $4, $5, true)`,
      [p.fecha, p.rival, "LaLiga EA Sports", p.localidad, JSON.stringify(asientos)]
    );
  }

  const res = await client.query("SELECT count(*) FROM partidos");
  console.log(`Seed completo. Total partidos: ${res.rows[0].count}`);

  // También actualizar configuracion_base con la Matriz B
  await client.query(
    `UPDATE configuracion_base SET asientos = $1 WHERE id = '00000000-0000-0000-0000-000000000000'`,
    [JSON.stringify(asientos)]
  );
  console.log("Configuracion_base actualizada con la Matriz B");

  await client.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
