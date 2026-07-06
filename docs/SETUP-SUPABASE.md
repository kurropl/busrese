# Setup Supabase — 5 minutos

## Por qué necesitas Supabase

Sin backend, los datos viven en el navegador del admin (localStorage). Los socios
no pueden ver los asientos ni confirmar desde sus móviles. Supabase es gratuito
(500MB) y sincroniza los datos entre todos los dispositivos.

## Pasos

### 1. Crear proyecto en Supabase

1. Ve a https://supabase.com → Sign up (con GitHub o email)
2. New Project → Nombre: `pena-betica-bus` → Region: Frankfurt (más cerca de España)
3. Genera una contraseña para la DB (guárdala, no la necesitarás para la app)
4. Espera ~2 min a que el proyecto se cree

### 2. Ejecutar la migración

1. En el panel de Supabase → **SQL Editor** → New query
2. Copia y pega TODO el contenido de `supabase/migrations/0001_init.sql`
3. Run

Esto crea las tablas `partidos` y `configuracion_base` con las políticas de
seguridad (RLS): lectura pública, escritura para admin, confirmación pública.

### 3. Crear usuario admin

1. En Supabase → **Authentication** → Users → Add user
2. Email: tu email · Password: una que recuerdes
3. Marca "Auto Confirm User" (para no necesitar verificación de email)

### 4. Obtener las claves

1. En Supabase → **Project Settings** → API
2. Copia:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon public key** (una cadena larga)

### 5. Configurar el repo

1. En GitHub: ve a https://github.com/kurropl/busrese/settings/secrets/actions
2. Add secret → Name: `VITE_SUPABASE_URL` → Value: la URL del paso 4
3. Add secret → Name: `VITE_SUPABASE_ANON_KEY` → Value: la anon key del paso 4

### 6. Actualizar el workflow

El workflow de deploy debe leer las secrets y pasarlas como variables de entorno
en el build. Edita `.github/workflows/deploy.yml`:

```yaml
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

### 7. Hacer push

Cualquier push a `main` desplegará con Supabase configurado. La primera vez
que el admin entre al dashboard, se crearán los 38 partidos automáticamente.

## Verificación

1. Abre https://kurropl.github.io/busrese/
2. Deberías ver los 38 partidos (cargados desde Supabase)
3. Entra a Admin → Login con el email/password del paso 3
4. Edita un partido → Copiar mensaje para el grupo
5. Abre el link en otro dispositivo/navegador → debería cargar el mapa
6. Pulsa un asiento → Confirma → El admin debería verlo en tiempo real
