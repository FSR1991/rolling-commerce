# Rolling Commerce

Rolling Commerce es un e-commerce de productos tecnologicos orientado a la venta de hardware y componentes para PC. La aplicacion permite navegar un catalogo, consultar productos, armar una PC por categorias, gestionar un carrito de usuario, iniciar checkout con Mercado Pago y administrar productos, categorias, ordenes, consultas y metricas desde un panel protegido.

## Stack

- Frontend: React 19, Vite 8, React Router 7, Bootstrap, React Bootstrap, Framer Motion, Lucide React, Recharts y SweetAlert2.
- Backend: Node.js 22, Express 5, MongoDB, Mongoose 9, JWT, bcryptjs, Multer, Cloudinary, Mercado Pago SDK y Nodemailer.
- Persistencia: MongoDB mediante modelos Mongoose.
- Pagos: Mercado Pago Checkout Pro creado desde el backend.
- Despliegue: frontend preparado para Vercel y backend Express preparado para un servicio Node.js como Render.

## Estructura Frontend/Backend

```text
rolling-commerce/
  client/
    src/
      components/   Componentes reutilizables, layout, carrito, productos y panel admin
      context/      Estado global de autenticacion y carrito
      pages/        Pantallas publicas, privadas, checkout y administracion
      routes/       Rutas React Router y clientes HTTP del backend
      styles/       Estilos por seccion
      utils/        Helpers de formato, validacion y persistencia local
    vercel.json     Configuracion de deploy del frontend

  server/
    index.js        Entrada de la API Express
    src/
      config/       MongoDB, Cloudinary y Mercado Pago
      controllers/  Adaptadores HTTP
      middlewares/  Autenticacion, autorizacion, errores y uploads
      models/       User, Product, Category, Cart, Order y ContactMessage
      routes/       Endpoints REST bajo /api
      services/     Logica de negocio e integraciones
      seed/         Carga inicial de productos
```

## Instalacion

Requisitos recomendados:

- Node.js 22.x.
- pnpm 10.x.
- MongoDB Atlas o una instancia MongoDB compatible.
- Credenciales de Cloudinary para imagenes de productos.
- Credenciales de Mercado Pago para checkout.

Instalar dependencias:

```bash
cd server
pnpm install

cd ../client
pnpm install
```

## Variables Requeridas

Crear archivos locales desde los ejemplos:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

En Windows PowerShell:

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

No subir archivos `.env` reales al repositorio.

Backend (`server/.env`):

- `NODE_ENV`
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `FRONTEND_URL`
- `BACKEND_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `MERCADOPAGO_ACCESS_TOKEN`

Frontend (`client/.env`):

- `VITE_API_URL`

## Scripts

Backend:

```bash
cd server
pnpm dev              # Ejecuta la API con nodemon
pnpm start            # Ejecuta la API con node
pnpm seed             # Carga productos base
pnpm test             # Check sintactico del entrypoint
pnpm check            # Check sintactico del entrypoint
pnpm test:order-state # Ejecuta pruebas de transiciones de orden
```

Frontend:

```bash
cd client
pnpm dev      # Servidor de desarrollo Vite
pnpm build    # Build de produccion
pnpm lint     # Analisis ESLint
pnpm preview  # Preview local del build
```

## Ejecucion Local

1. Configurar `server/.env` y `client/.env`.
2. Iniciar el backend:

```bash
cd server
pnpm dev
```

3. Iniciar el frontend en otra terminal:

```bash
cd client
pnpm dev
```

4. Abrir el frontend en `http://localhost:5173`.

Para desarrollo local, `VITE_API_URL` debe apuntar al backend, por ejemplo `http://localhost:3000/api`.

## Funcionamiento General

El frontend es una SPA con rutas para inicio, catalogo, detalle de producto, carrito, checkout, armado de PC, contacto, paginas informativas, autenticacion y panel admin. La autenticacion se guarda en el cliente y se envia al backend mediante JWT en el header `Authorization`.

El backend expone una API REST bajo `/api`. Las rutas publicas permiten consultar productos, categorias, autenticarse y enviar consultas. Las rutas privadas gestionan carrito, checkout y ordenes del usuario. Las rutas administrativas requieren rol `admin` para operar productos, categorias, ventas, usuarios, consultas y metricas.

El carrito se persiste en MongoDB por usuario. El checkout envia al backend solo identificadores y cantidades; el backend recalcula precios, valida stock, crea una orden pendiente y genera una preferencia de Mercado Pago. Los webhooks de pago actualizan el estado de la orden y sincronizan el stock cuando corresponde.

## Despliegue

El frontend se despliega como sitio estatico generado por Vite. `client/vercel.json` define `pnpm install`, `pnpm build`, salida `dist` y rewrites hacia `index.html` para soportar React Router.

El backend se despliega como servicio Node.js ejecutando `pnpm start` dentro de `server/`. El entorno productivo debe configurar las variables del backend, una base MongoDB accesible, credenciales de Cloudinary y credenciales de Mercado Pago. Para que Mercado Pago notifique pagos, `BACKEND_URL` debe ser una URL publica y `CLIENT_URL` debe apuntar al dominio real del frontend.
