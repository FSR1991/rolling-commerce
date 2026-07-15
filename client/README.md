# Rolling Commerce

Aplicación Full Stack de comercio electrónico desarrollada con React, Node.js, Express y MongoDB.

---

# Producción

## Frontend

https://rolling-commerce-alpha.vercel.app

## Backend

https://rolling-commerce-api.onrender.com

---

# Arquitectura

Frontend

- React
- Vite
- Bootstrap
- React Router

Backend

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT
- Cloudinary
- Mercado Pago

Infraestructura

- Frontend → Vercel
- Backend → Render
- Base de datos → MongoDB Atlas

---

# Instalación

## Clonar repositorio

```bash
git clone https://github.com/FSR1991/rolling-commerce.git
```

## Frontend

```bash
cd client
pnpm install
pnpm dev
```

## Backend

```bash
cd server
pnpm install
pnpm start
```

---

# Variables de entorno

## Frontend

```env
VITE_API_URL=http://localhost:3000/api
```

## Backend

```env
PORT=
NODE_ENV=
MONGO_URI=
JWT_SECRET=
FRONTEND_URL=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

MERCADOPAGO_ACCESS_TOKEN=
```

---

# Credenciales de prueba

## Vendedor (Seller Test User)

| Campo | Valor |
|-------|-------|
| Usuario | TESTUSER2008579987999733683 |
| Contraseña | jEAWIGxJTP |
| Código | 170282 |

---

## Comprador (Buyer Test User)

| Campo | Valor |
|-------|-------|
| Usuario | TESTUSER6309809227629950011 |
| Contraseña | 2OfkDwkTWv |
| Código | 493608 |

---

# 💳 Tarjetas de prueba

## Visa

Número

```
4509 9535 6623 3704
```

CVV

```
123
```

Vencimiento

```
11/30
```

---

## Mastercard

Número

```
5031 7557 3453 0604
```

CVV

```
123
```

Vencimiento

```
11/30
```

---

## American Express

Número

```
3711 803032 57522
```

CVV

```
1234
```

Vencimiento

```
11/30
```

---

## Mastercard Débito

Número

```
5287 3383 1025 3304
```

CVV

```
123
```

Vencimiento

```
11/30
```

---

## Visa Débito

Número

```
4002 7686 9439 5619
```

CVV

```
123
```

Vencimiento

```
11/30
```

---

# Estado del proyecto

✔ Frontend desplegado en Vercel

✔ Backend desplegado en Render

✔ Base de datos MongoDB Atlas

✔ Integración Cloudinary

✔ Integración Mercado Pago

✔ Autenticación JWT

✔ Recuperación de contraseña mediante correo electrónico

---

#  Autores

Proyecto desarrollado por Alexis Arreyes, Facundo Solano Rodriguez, Miguel Gomez y Luciano Cano como práctica Full Stack utilizando React, Node.js, Express y MongoDB.
