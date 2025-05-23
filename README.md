# El Lector Voraz

Sistema de gestión para librería y cafetería "El Lector Voraz".

## Descripción

Esta aplicación web permite administrar el inventario, ventas, clientes y reportes financieros de una librería con cafetería integrada.

## Características

- Gestión de inventario de libros
- Gestión de productos de cafetería
- Sistema de ventas
- Administración de clientes
- Reportes financieros
- Panel de administración

## Requisitos

- Node.js (v14 o superior)
- npm

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/el-lector-voraz.git
cd el-lector-voraz
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
- `PORT`: Puerto en el que se ejecutará el servidor (por defecto: 3000)
- `API_KEY`: Clave de API para acceder a los endpoints protegidos (ejemplo: "el-voraz-2025")
```

## Uso

1. Iniciar el servidor:
```bash
npm start
```

2. Acceder a la aplicación:
- Abrir el navegador en `http://localhost:3000`

## Credenciales de Prueba

- **Administrador**:
  - Email: admin1@lectorvoraz.com
  - Contraseña: admin123

- **Usuario**:
  - Email: user@lectorvoraz.com
  - Contraseña: user123

## Flujo de productos/libros
Desde la web (como admin)
1. Inicia sesión como admin.
2. Ve a Catálogo de Libros.
3. Verás un formulario para agregar libros.
4. Al enviar el formulario:
  - Se hace un POST a /api/products.
  - El backend guarda el libro en src/data/products.json.
  - La página se recarga y muestra el nuevo libro.

Desde Thunder Client o Postman
- GET /api/products
Obtienes el listado de libros en formato JSON.
- POST /api/products
Debes enviar la API Key en el header (por seguridad).
Ejemplo de header:
```text
x-api-key: TU_API_KEY
```
El cuerpo debe ser un JSON con los datos del libro.

## Seguridad de la API
- Desde la web:
Si el usuario está logueado como admin, NO se requiere API Key para agregar libros.
- Desde clientes externos:
Siempre se requiere API Key para POST, PUT y DELETE.

## Estructura de archivos relevante
- src/data/products.json — Base de datos de libros (JSON).
- views/products.pug — Catálogo de libros y formulario de alta.
- src/routes/productRoutes.js — Rutas de la API de productos/libros.
- src/controllers/webController.js — Renderizado de vistas web.

## Notas
- El sistema de sesiones mantiene la autenticación de usuarios en la web.
- El formulario de alta de libros solo es visible para usuarios con rol admin.
- Los cambios hechos desde la web y desde la API se reflejan en el mismo archivo JSON.

## Licencia

[MIT](LICENSE)