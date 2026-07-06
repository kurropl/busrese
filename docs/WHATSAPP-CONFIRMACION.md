# Análisis: Confirmación de Asistencia por WhatsApp
## Peña Bética Cultural El Arco Rafael Villa — Autobús 26/27

---

## 1. Problema a resolver

El admin necesita enviar un mensaje a cada ocupante del autobús antes de cada
partido para confirmar si va a asistir. Si alguien cancela, su plaza queda
libre para reasignar.

**Flujo deseado:**

```
Admin pulsa "Enviar confirmaciones" en un partido
  → Se genera un mensaje personalizado por ocupante
  → Cada mensaje incluye un link único con su asiento
  → El ocupante abre el link y marca: "Confirmo" o "No puedo ir"
  → El sistema actualiza el estado del asiento en tiempo real
  → El admin ve quién ha confirmado y quién no en el dashboard
```

---

## 2. Opciones técnicas evaluadas

### Opción A — Links `wa.me` (recomendada para empezar)

**Cómo funciona:** La app genera un link `https://wa.me/34600123456?text=...`
por cada ocupante. El admin hace clic y se abre WhatsApp con el mensaje
pre-escrito. El ocupante recibe el mensaje, pulsa el link de confirmación
incrustado y responde en la web.

| Pros | Contras |
| :--- | :--- |
| Cero coste, sin API ni backend extra | El admin debe hacer clic en cada link (no es automático) |
| No requiere aprobación de Meta | No hay confirmación de entrega automática |
| Funciona desde el móvil del admin | Limitado a ~1000 caracteres en el texto |
| Compatible con cualquier número | El ocupante debe tener WhatsApp |

**Implementación:**
- Tabla `confirmaciones` en Supabase: `partido_id`, `asiento_id`, `token`,
  `estado` (pendiente/confirmado/cancelado), `fecha_respuesta`
- Al pulsar "Enviar confirmaciones", se generan tokens únicos por asiento
- Se construye el link: `wa.me/<telefono>?text=<mensaje_codificado>`
- El mensaje incluye: `https://pena-betica.pages.dev/confirmar/<token>`
- La ruta `/confirmar/:token` muestra una página simple con dos botones

### Opción B — WhatsApp Business API (Cloud API de Meta)

**Cómo funciona:** Integración oficial con la Cloud API de Meta. Envío
automático masivo desde el backend. Requiere Meta Business Account verificada
y plantilla de mensaje aprobada.

| Pros | Contras |
| :--- | :--- |
| Envío automático masivo (1 clic) | Requiere verificación de negocio en Meta |
| Confirmación de entrega y lectura | Coste por mensaje (~0.05€/conversación) |
| Plantillas con botones interactivos | Proceso de aprobación de plantillas (24-48h) |
| Webhooks de respuesta automática | Necesita backend con endpoint webhook |
| Escalable a cientos de mensajes | Restricciones: solo plantillas aprobadas |

**Implementación:**
- Registrar app en Meta for Developers → WhatsApp Business API
- Crear plantilla: "Hola {nombre}, confirmas tu plaza del asiento {numero}
  para {partido}? Botones: [Confirmo] [No puedo ir]"
- Backend (Supabase Edge Function o Cloudflare Worker):
  - `POST /api/confirmaciones/enviar` → recorre asientos, envía mensaje
  - `POST /webhook/whatsapp` → recibe respuestas de botones, actualiza estado
- Los botones interactivos envían un payload al webhook → actualiza DB

### Opción C — Twilio WhatsApp API

**Cómo funciona:** Twilio actúa como intermediario de la WhatsApp Business
API. Más sencillo de configurar que Meta directa, pero con coste adicional.

| Pros | Contras |
| :--- | :--- |
| Setup más simple que Meta directa | Coste extra sobre el precio de Meta |
- SDK para Node/Python, buena documentación | Misma restricción de plantillas |
- Webhooks gestionados por Twilio | Número de Twilio (no tu número real) |
- Dashboard de entrega y errores | ~0.005€ por mensaje enviado |

### Opción D — Bot no oficial (whatsapp-web.js / Baileys)

**Cómo funciona:** Librería que automatiza WhatsApp Web mediante un QR code.
Usa tu número real sin API oficial.

| Pros | Contras |
| :--- | :--- |
| Cero coste, usa tu número | **Viola los Términos de Servicio de Meta** |
- Envío automático masivo | Riesgo de ban del número |
- Sin aprobación de plantillas | Requiere servidor Node.js siempre activo |
- Mensajes personalizados libres | Inestable: se rompe con cada update de WA |

**NO recomendado** — puede provocar el baneo permanente del número de la peña.

---

## 3. Recomendación

### Fase 1 (ahora, sin coste): Opción A — Links `wa.me`

Implementar el sistema de confirmación con links `wa.me` manuales + página
web de respuesta. Es inmediato, gratuito y suficiente para 60 ocupantes.

**Esquema de datos adicional en Supabase:**

```sql
CREATE TABLE confirmaciones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partido_id  UUID REFERENCES partidos(id) ON DELETE CASCADE,
  asiento_id  TEXT NOT NULL,           -- "1", "2", "F-CHOFER", etc.
  ocupante    TEXT NOT NULL,
  telefono    TEXT,                    -- formato internacional: 34600123456
  token       TEXT NOT NULL UNIQUE,    -- token único para el link
  estado      TEXT NOT NULL DEFAULT 'pendiente',
  -- pendiente | confirmado | cancelado
  fecha_envio     TIMESTAMPTZ,
  fecha_respuesta TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- RLS: lectura pública solo con token válido
-- Escritura: solo admin puede crear, público puede actualizar estado con token
```

**Flujo:**

1. Admin entra al partido → botón "Generar confirmaciones"
2. Se crean 60 registros en `confirmaciones` (uno por asiento ocupado)
3. Se muestra una lista con un botón `wa.me` por cada ocupante con teléfono
4. Admin hace clic → se abre WhatsApp con el mensaje pre-escrito
5. El mensaje incluye: `https://pena-betica.pages.dev/confirmar/<token>`
6. Ocupante abre link → ve su asiento y dos botones: "Confirmo" / "No puedo"
7. Al pulsar, se actualiza `estado` en la DB
8. Admin ve en el dashboard: confirmados / pendientes / cancelados

### Fase 2 (si se quiere automatizar): Opción B — Cloud API de Meta

Cuando la peña quiera envío masivo automático con 1 clic, migrar a WhatsApp
Business API. El sistema de tokens y página de confirmación ya estará
construido en la Fase 1, solo se añade el envío automático.

---

## 4. Mensaje plantilla (Fase 1)

```
Hola {ocupante}, soy de la Peña Bética El Arco.

Tienes asignado el asiento {numero} para el partido
{rival} ({local_visitante}) del {fecha}.

Confirma tu asistencia aquí:
https://pena-betica.pages.dev/confirmar/{token}

Gracias! 🟢⚪️
```

---

## 5. Componentes a desarrollar (Fase 1)

| Componente | Descripción |
| :--- | :--- |
| `ConfirmacionesPanel` | Vista admin dentro de BusEditPage: lista de ocupantes con teléfono, botón wa.me por cada uno, estado de confirmación |
| `ConfirmarPage` | Página pública `/confirmar/:token` — muestra asiento, partido, y botones Confirmo / No puedo |
| `lib/confirmaciones.ts` | Funciones CRUD: generarConfirmaciones, getConfirmacion, responderConfirmacion |
| `Migración SQL` | Tabla `confirmaciones` + RLS con policy de lectura/escritura por token |
