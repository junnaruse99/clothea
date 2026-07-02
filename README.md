# Clothea 🌸

Tienda online de **ropa femenina asequible en Lima, Perú** — prototipo funcional (MVP).

| Carpeta  | Stack                                  | Puerto |
| -------- | -------------------------------------- | ------ |
| `front/` | Next.js (App Router) + Tailwind CSS v4 | 3000   |
| `back/`  | Node.js + TypeScript + Express + Zod   | 4000   |

Base de datos: **Supabase** (PostgreSQL). Si no configuras credenciales, el backend
arranca en **modo demo** con datos de ejemplo en memoria, así puedes probar todo
sin crear nada.

## Cómo correrlo

```bash
# Terminal 1 — API
cd back
npm install
npm run dev        # http://localhost:4000

# Terminal 2 — Web
cd front
npm install
npm run dev        # http://localhost:3000
```

Listo: abre http://localhost:3000. El panel admin está en
http://localhost:3000/admin (clave por defecto: `clothea-admin`).

## Conectar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En el **SQL Editor** ejecuta `back/supabase/schema.sql` y luego
   `back/supabase/seed.sql`.
3. Copia `back/.env.example` a `back/.env` y completa:
   - `SUPABASE_URL` (Settings → API → Project URL)
   - `SUPABASE_SERVICE_ROLE_KEY` (Settings → API → service_role)
   - `ADMIN_KEY` con tu propia clave de administración
4. Reinicia el backend. Verás `[store] usando Supabase` en la consola.

## Funcionalidades

**Tienda** (responsive, móvil y desktop)

- Productos en la página principal con sidebar de categorías, búsqueda y filtro de ofertas
- Página de producto con galería, tallas con stock, precios de oferta
- Página "Nosotros" (moda femenina asequible)
- Carrito persistente (localStorage)
- Checkout con datos de entrega y **costo de delivery calculado por distancia**
- Pasarela de pago *mock* que confirma la orden y descuenta stock

**Panel admin** (`/admin`, protegido por clave)

- CRUD de productos: código, nombre, descripción, categoría, color, precio,
  precio de oferta, tallas con cantidades, visible/oculto y **subida de fotos**
- Configuración del algoritmo de delivery con vista previa de tarifas por distrito
- Listado de órdenes con cliente, items y totales

## Algoritmo de delivery (personalizable)

```
tarifa = max(minFee, baseFee + perKmFee × distancia_km) + recargo_distrito
gratis si subtotal ≥ freeThreshold
```

La distancia se calcula (Haversine) desde la ubicación de la tienda hasta el
centro del distrito elegido. Todos los parámetros se editan en
**Admin → Delivery** y los recargos por distrito viven en la tabla `districts`.
Para cambiar la fórmula misma, edita `back/src/delivery.ts`.

## API (resumen)

| Método | Ruta                         | Descripción                              |
| ------ | ---------------------------- | ---------------------------------------- |
| GET    | `/api/categories`            | Categorías                               |
| GET    | `/api/products`              | Productos (`?category=&search=&sale=`)   |
| GET    | `/api/products/:id`          | Detalle de producto                      |
| GET    | `/api/delivery/districts`    | Distritos de Lima                        |
| POST   | `/api/delivery/quote`        | Cotiza delivery `{districtId, subtotal}` |
| POST   | `/api/orders`                | Crea orden + sesión de pago              |
| POST   | `/api/orders/:id/pay`        | Confirma pago (mock) y descuenta stock   |
| GET    | `/api/orders/:id`            | Detalle de orden                         |
| \*     | `/api/admin/...`             | CRUD productos, config delivery, órdenes y subida de fotos (header `x-admin-key`) |

## Rutas de crecimiento previstas

- **Fotos**: hoy se guardan en `back/uploads/` (en el repo) vía
  `multer.diskStorage`. Para migrar a S3 o Supabase Storage solo se reemplaza
  ese storage en `back/src/routes/admin.ts` — el contrato (subir → devolver
  URL) no cambia.
- **Pagos**: el gateway es un mock. El punto de integración está en
  `back/src/routes/orders.ts`: al crear la orden se genera la sesión de pago
  (ahí iría Culqi o MercadoPago, populares en Perú) y `/pay` se convierte en
  el webhook del proveedor.
- **Auth admin**: clave simple por header; migrar a Supabase Auth con roles.
- **Stock**: variantes en JSONB; con más volumen, mover a tabla propia con
  decremento atómico.
