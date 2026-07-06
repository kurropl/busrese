# Peña Bética Cultural El Arco · Rafael Villa
## WebApp Gestión de Plazas de Autobús — Temporada 26/27

React + Vite + Tailwind + Supabase. Build estático desplegable en Cloudflare Pages o GitHub Pages.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
npm run preview  # sirve dist/ en :4173
```

## Modo demo (sin Supabase)

Si no configuras las variables de entorno, la app funciona con `localStorage`:
- Cualquier email/password entra al panel admin
- Los partidos se guardan en el navegador

## Modo producción (con Supabase)

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ejecuta la migración: `supabase/migrations/0001_init.sql`
3. Copia `.env.example` a `.env` y rellena:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
4. Crea un usuario admin desde el panel de Supabase (Auth → Users → Add user)
5. `npm run build`

---

## Despliegue

### Opción A: Cloudflare Pages (recomendado)

```bash
# Método 1: token (CI/automático)
export CLOUDFLARE_API_TOKEN="tu-token"
export CLOUDFLARE_ACCOUNT_ID="tu-account-id"
./deploy.sh

# Método 2: interactivo (local)
npx wrangler login
./deploy.sh
```

O conecta el repo a Cloudflare Pages desde el dashboard:
- Build command: `npm run build`
- Output dir: `dist`
- Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

### Opción B: GitHub Pages

```bash
gh auth login
gh repo create pena-betica-bus --public --source=. --push
# En el repo: Settings → Pages → Source → GitHub Actions
```

O con `gh-pages`:
```bash
npm install -D gh-pages
npm run build
npx gh-pages -d dist
```

---

## Estructura

```
src/
├── components/
│   ├── bus/          # BusMap, Seat, SeatRow, SeatFrontal, SeatEditModal, BusViewPage, BusEditPage
│   ├── partidos/     # PartidosListPage, PartidoCard
│   ├── admin/        # LoginPage, DashboardPage, PartidoForm, PartidosTable
│   └── ui/           # Header, Legend
├── context/          # AuthContext (Supabase + fallback local)
├── data/             # matrizB.ts (78 plazas por defecto)
├── lib/              # supabase.ts, db.ts (capa de datos)
├── types/            # Asiento, Partido, EstadoAsiento
└── App.tsx           # Router + rutas públicas/admin
```

## Matriz B — 78 plazas

| Zona       | Asientos | Estado por defecto           |
|:-----------|:--------:|:-----------------------------|
| Frontal    | 6        | Chófer + Guía + 4 libres     |
| Filas 1-15 | 60       | Ocupadas (nombres asignados) |
| Filas 16-18| 12       | Libres                       |

## Acciones admin (sobre asientos)

| Acción     | Resultado                              |
|:-----------|:---------------------------------------|
| Desasignar | estado → Libre, ocupante → null        |
| Sustituir  | cambia ocupante, mantiene estado       |
| Restaurar  | vuelve al estado original de la Matriz B |
