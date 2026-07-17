<p align="center">
  <img src="client/src/assets/logo.png" alt="Tech Core" width="220" />
</p>

<h1 align="center">Rolling Commerce</h1>

<p align="center">
  E-commerce de componentes y equipos informáticos
  <br />
  Proyecto final — Rolling Code School
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2.5-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19.2.5" />
  <img src="https://img.shields.io/badge/Vite-8.0.10-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8.0.10" />
  <img src="https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js 22" />
  <img src="https://img.shields.io/badge/Express-5.2.1-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express 5.2.1" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose%209.4.1-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB con Mongoose 9.4.1" />
  <img src="https://img.shields.io/badge/Mercado%20Pago-2.12.0-009EE3?style=for-the-badge" alt="Mercado Pago 2.12.0" />
  <img src="https://img.shields.io/badge/Cloudinary-2.4.0-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary 2.4.0" />
  <img src="https://img.shields.io/badge/pnpm-10.33.0-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm 10.33.0" />
</p>

Rolling Commerce es un e-commerce de productos tecnologicos orientado a la venta de hardware y componentes para PC. La aplicacion permite navegar un catalogo, consultar productos, armar una PC por categorias, gestionar un carrito de usuario, iniciar checkout con Mercado Pago y administrar productos, categorias, ordenes, consultas y metricas desde un panel protegido.

## Vista previa

<p align="center">
  <img src="client/src/assets/1.jpg" alt="Página principal de Rolling Commerce" width="100%" />
</p>

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

## Pruebas de Mercado Pago

> **Advertencia:** Los pagos de esta demostracion deben ejecutarse exclusivamente en un entorno configurado con credenciales de prueba de Mercado Pago. Antes de iniciar una prueba, el responsable del entorno debe verificar que `MERCADOPAGO_ACCESS_TOKEN` comience con `TEST-`. El token nunca debe incluirse en el repositorio ni compartirse con los evaluadores.

`server/.env` debe crearse localmente a partir de `server/.env.example` y permanecer fuera de Git. Si `MERCADOPAGO_ACCESS_TOKEN` no esta configurada, el catalogo y las demas funciones pueden evaluarse, pero no debe iniciarse el checkout. Los profesores no necesitan conocer el Access Token y nunca deben copiarse tokens reales al README.

Estas instrucciones son exclusivamente para el entorno academico y sandbox:

- No realizar pagos reales ni usar credenciales productivas.
- Las tarjetas indicadas son ficticias y no deben utilizarse fuera del entorno de prueba.
- No ingresar nombres, documentos, telefonos, correos ni otros datos personales reales.
- La cuenta que inicia la compra en Mercado Pago debe ser una cuenta de prueba de tipo **Comprador**.
- Comprador y Vendedor deben ser cuentas de prueba diferentes y pertenecer al mismo pais.
- Nunca publicar `MERCADOPAGO_ACCESS_TOKEN`, aunque sea de prueba.
- Nunca publicar la contraseña de una cuenta real de Mercado Pago.

### Tarjetas sandbox para Argentina

| Tarjeta | Numero | Codigo de seguridad | Vencimiento |
|---|---|---:|---:|
| Visa credito | `4509 9535 6623 3704` | `123` | `11/30` |
| Mastercard credito | `5031 7557 3453 0604` | `123` | `11/30` |

El resultado se selecciona combinando cualquiera de esas tarjetas con el nombre del titular indicado por Mercado Pago:

| Escenario | Nombre y apellido del titular | Documento ficticio | Resultado esperado |
|---|---|---|---|
| Pago aprobado | `APRO` | DNI `12345678` | Aprobado |
| Pago rechazado por error general | `OTHE` | DNI `12345678` | Rechazado |
| Pago pendiente | `CONT` | No requerido por la tabla oficial | Pendiente |

No se publica una cuenta compradora especifica del proyecto porque no se pudo verificar que la cuenta historica siga activa, sea de tipo Comprador y pertenezca a un entorno aislado. El responsable de la demostracion debe obtener o crear la cuenta desde **Mercado Pago Developers > Tus integraciones > Cuentas de prueba** y comprobar su tipo. La cuenta compradora de Mercado Pago se entregara de manera privada a los profesores si el flujo la requiere. Como el repositorio es publico, su usuario, contraseña y codigo de verificacion no deben agregarse al README, y conviene regenerar la contraseña despues de la evaluacion.

### Flujo para la evaluacion

1. Confirmar en el backend, sin imprimirlo, que el Access Token comienza con `TEST-`.
2. Iniciar sesion en Rolling Commerce con una cuenta academica.
3. Agregar al carrito un producto activo con stock disponible.
4. Ir al checkout y completar exclusivamente datos ficticios.
5. Abrir Mercado Pago desde el boton de pago.
6. Iniciar sesion con la cuenta de prueba de tipo Comprador si el checkout lo solicita.
7. Utilizar una tarjeta sandbox y elegir `APRO`, `CONT` u `OTHE` como titular para simular un pago aprobado, pendiente o rechazado.
8. Regresar a Rolling Commerce mediante la URL de retorno correspondiente.
9. Verificar el estado de la orden y comprobar que el carrito solo se limpie cuando la orden figure pagada.
10. Ingresar al panel administrativo y verificar el estado de la orden y el stock del producto.

Fuentes oficiales consultadas:

- [Tarjetas de prueba para Argentina](https://www.mercadopago.com.ar/developers/es/docs/your-integrations/test/cards)
- [Cuentas de prueba de Mercado Pago](https://www.mercadopago.com.ar/developers/es/docs/your-integrations/test/accounts)

## Despliegue

El frontend se despliega como sitio estatico generado por Vite. `client/vercel.json` define `pnpm install`, `pnpm build`, salida `dist` y rewrites hacia `index.html` para soportar React Router.

El backend se despliega como servicio Node.js ejecutando `pnpm start` dentro de `server/`. El entorno productivo debe configurar las variables del backend, una base MongoDB accesible, credenciales de Cloudinary y credenciales de Mercado Pago. Para que Mercado Pago notifique pagos, `BACKEND_URL` debe ser una URL publica y `CLIENT_URL` debe apuntar al dominio real del frontend.
