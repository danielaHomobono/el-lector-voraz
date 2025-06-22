# El Lector Voraz

Sistema de gestión para librería y cafetería "El Lector Voraz".

## Descripción

Esta aplicación web permite administrar el inventario, ventas, clientes y reportes financieros de una librería con cafetería integrada.

## Características

### Experiencia de Usuario
- **Tema Claro/Oscuro**: Cambio de tema según preferencia del usuario
- **Diseño Responsivo**: Adaptación a diferentes tamaños de pantalla
- **Accesibilidad**: Implementación de atributos ARIA y buenas prácticas

### Gestión de Productos
- **Gestión de inventario de libros**: Agregar, editar, eliminar y buscar libros por título, autor o ISBN
- **Gestión de productos de cafetería**: Administrar bebidas con stock y precios
- **Gestión de inventario de libros**: Control y stock mínimo
- **Búsqueda y filtrado**: Búsqueda avanzada en todos los catálogos
- **Ordenamiento**: Ordenar productos por diferentes criterios

### Sistema de Ventas
- **Carrito de compras**: Agregar productos, modificar cantidades, eliminar items
- **Proceso de checkout**: Formulario de pago con múltiples métodos de pago
- **Confirmación de compra**: Página de confirmación con detalles del pedido
- **Registro de ventas**: Historial completo de todas las transacciones
- **Filtros de ventas**: Filtrar por fecha, canal de venta y tipo de producto

### Gestión de Usuarios y Clientes
- **Sistema de autenticación**: Login con roles (admin, staff, client)
- **Gestión de usuarios**: Crear, editar y eliminar usuarios del sistema
- **Gestión de clientes**: Base de datos de clientes con puntos y contacto
- **Control de acceso**: Middleware de autorización por roles
- **Sesiones seguras**: Sistema de sesiones con JWT

### Chat de Soporte en Tiempo Real
- **Chat para clientes**: Interfaz de chat para consultas y soporte
- **Panel de soporte**: Interfaz para administradores y staff
- **Comunicación bidireccional**: Mensajes en tiempo real con Socket.IO
- **Respuestas rápidas**: Botones con respuestas predefinidas
- **Indicadores de estado**: Mostrar si usuarios están conectados
- **Notificaciones**: Alertas cuando llegan mensajes nuevos

### Reportes y Análisis
- **Reportes financieros**: Análisis de ventas, ingresos y tendencias
- **Gráficos interactivos**: Visualización de datos con Chart.js
- **Filtros por fecha**: Reportes personalizables por período
- **Exportación a CSV**: Descarga de reportes en formato CSV
- **Análisis por canal**: Ventas por web, presencial, etc.
- **Análisis por tipo**: Separación entre libros y productos de cafetería

### Marketing y Contenido
- **Sistema de posts**: Crear y gestionar contenido promocional
- **API de marketing**: Endpoints para gestión de contenido
- **Publicaciones**: Sistema de blog/posts para promociones

### Características Técnicas
- **API RESTful**: Endpoints completos para todas las funcionalidades
- **Seguridad API**: Autenticación con API Key para endpoints protegidos
- **Manejo de errores**: Sistema robusto de manejo de errores
- **Interfaz responsiva**: Diseño adaptativo para móviles y desktop
- **Accesibilidad**: Implementación de estándares de accesibilidad web
- **Optimización de rendimiento**: Minificación de CSS
- **Guía de estilos**: Sistema de diseño coherente con variables CSS

## Requisitos

- Node.js (v14 o superior)
- npm
- MongoDB (opcional, el sistema funciona con archivos JSON)

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
- `JWT_SECRET`: Clave secreta para JWT (opcional)
- `MONGODB_URI`: URI de conexión a MongoDB (opcional)
```

4. Construir archivos para producción (opcional):
```bash
npm run build
```

## Uso

1. Iniciar el servidor en modo desarrollo:
```bash
npm run dev
```

2. Iniciar el servidor en modo producción:
```bash
npm run build:prod
```

3. Acceder a la aplicación:
- Abrir el navegador en `http://localhost:3000`

4. Cambiar entre tema claro y oscuro:
- Usar el botón de cambio de tema en la barra de navegación



## Credenciales de Prueba

### Administradores:
- **Email**: admin1@lectorvoraz.com
- **Contraseña**: admin123

- **Email**: admin2@lectorvoraz.com  
- **Contraseña**: admin123

- **Email**: admin3@lectorvoraz.com
- **Contraseña**: admin123

### Staff:
- **Email**: staff@lectorvoraz.com
- **Contraseña**: staff123

### Clientes:
- **Email**: user@lectorvoraz.com
- **Contraseña**: user123

- **Email**: roma@gmail.com
- **Contraseña**: 123456

## Funcionalidades por Rol

### Administrador (admin)
- Acceso completo a todas las funcionalidades
- Gestión de usuarios y clientes
- Administración de inventario completo
- Reportes financieros
- Panel de soporte
- Gestión de marketing

### Staff
- Gestión de inventario de libros y cafetería
- Atención al cliente en chat de soporte
- Registro de ventas
- Acceso a reportes básicos

### Cliente
- Navegación del catálogo de libros y cafetería
- Carrito de compras y checkout
- Chat de soporte
- Historial de compras

## API Endpoints

### Productos
- `GET /api/products` - Obtener todos los productos
- `POST /api/products` - Crear nuevo producto (requiere API Key)
- `PUT /api/products/:id` - Actualizar producto (requiere API Key)
- `DELETE /api/products/:id` - Eliminar producto (requiere API Key)

### Cafetería
- `GET /api/cafe` - Obtener productos de cafetería
- `POST /api/cafe` - Crear producto de cafetería (requiere API Key)
- `PUT /api/cafe/:id` - Actualizar producto (requiere API Key)
- `DELETE /api/cafe/:id` - Eliminar producto (requiere API Key)

### Ventas
- `GET /api/ventas` - Obtener historial de ventas
- `POST /api/ventas` - Registrar nueva venta (requiere API Key)
- `GET /api/ventas/:id` - Obtener detalles de venta específica

### Usuarios
- `GET /api/users` - Obtener usuarios (requiere API Key)
- `POST /api/users` - Crear usuario (requiere API Key)
- `PUT /api/users/:id` - Actualizar usuario (requiere API Key)
- `DELETE /api/users/:id` - Eliminar usuario (requiere API Key)

### Clientes
- `GET /api/clients` - Obtener clientes (requiere API Key)
- `POST /api/clients` - Crear cliente (requiere API Key)
- `PUT /api/clients/:id` - Actualizar cliente (requiere API Key)
- `DELETE /api/clients/:id` - Eliminar cliente (requiere API Key)

### Marketing
- `GET /api/marketing/posts` - Obtener posts
- `POST /api/marketing/posts` - Crear post (requiere API Key)
- `PUT /api/marketing/posts/:id` - Actualizar post (requiere API Key)
- `DELETE /api/marketing/posts/:id` - Eliminar post (requiere API Key)

### Reportes
- `GET /api/reports/financial` - Reporte financiero
- `GET /api/reports/sales` - Reporte de ventas

## Seguridad de la API

### Desde la web:
- Si el usuario está logueado como admin, NO se requiere API Key para operaciones básicas
- Las operaciones sensibles siempre requieren autenticación

### Desde clientes externos:
- Siempre se requiere API Key para POST, PUT y DELETE
- Header requerido: `x-voraz-key: EL_VORAZ_2025`

## Estructura de archivos relevante

### Datos
- `src/data/products.json` — Base de datos de libros (JSON)
- `src/data/cafe_products.json` — Base de datos de productos de cafetería
- `src/data/sales.json` — Historial de ventas
- `src/data/users.json` — Usuarios del sistema
- `src/data/clients.json` — Base de datos de clientes
- `src/data/posts.json` — Contenido de marketing

### Vistas
- `views/products.pug` — Catálogo de libros y formulario de alta
- `views/cafes.pug` — Catálogo de cafetería
- `views/cart.pug` — Carrito de compras
- `views/checkout.pug` — Proceso de pago
- `views/chat.pug` — Chat de soporte para clientes
- `views/support.pug` — Panel de soporte para staff
- `views/inventory.pug` — Gestión de inventario de libros
- `views/stock.pug` — Gestión de inventario de cafetería
- `views/sales.pug` — Historial de ventas
- `views/financial.pug` — Reportes financieros
- `views/users.pug` — Gestión de usuarios
- `views/clients.pug` — Gestión de clientes

### Controladores y Rutas
- `src/routes/productRoutes.js` — Rutas de la API de productos/libros
- `src/routes/cafeRoutes.js` — Rutas de la API de cafetería
- `src/routes/saleRoutes.js` — Rutas de la API de ventas
- `src/routes/userRoutes.js` — Rutas de la API de usuarios
- `src/routes/clientRoutes.js` — Rutas de la API de clientes
- `src/routes/marketingRoutes.js` — Rutas de la API de marketing
- `src/routes/reportRoutes.js` — Rutas de la API de reportes
- `src/controllers/webController.js` — Renderizado de vistas web

### JavaScript del Cliente
- `public/js/cart.js` — Funcionalidad del carrito de compras
- `public/js/chat.js` — Chat de soporte para clientes
- `public/js/support.js` — Panel de soporte para staff
- `public/js/inventory.js` — Gestión de inventario
- `public/js/main.js` — Funcionalidades generales

## Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Socket.IO** - Comunicación en tiempo real
- **Pug** - Motor de plantillas
- **bcryptjs** - Encriptación de contraseñas
- **JWT** - Autenticación por tokens
- **Mongoose** - ODM para MongoDB

### Frontend
- **Vanilla JavaScript** - Funcionalidad del cliente
- **CSS3** - Estilos y diseño responsivo
- **Chart.js** - Gráficos para reportes
- **Socket.IO Client** - Cliente para comunicación en tiempo real

## Guía de Estilos

El proyecto utiliza una guía de estilos centralizada para mantener la coherencia visual en toda la aplicación. Para más detalles, consulta [STYLE_GUIDE.md](STYLE_GUIDE.md).

### Características de Diseño
- **Tema Claro/Oscuro** - Soporte para cambio de tema
- **Diseño Responsivo** - Adaptable a dispositivos móviles y desktop
- **Accesibilidad** - Implementación de ARIA y buenas prácticas

### Estructura CSS
- **variables.css** - Variables CSS centralizadas
- **styles.css** - Estilos globales
- **common.css** - Componentes compartidos
- **[page].css** - Estilos específicos por página

### Base de Datos
- **JSON Files** - Almacenamiento de datos (configurable)
- **MongoDB** - Base de datos opcional (modelos preparados)

## Notas Importantes

- El sistema de sesiones mantiene la autenticación de usuarios en la web
- Los formularios de alta solo son visibles para usuarios con permisos apropiados
- Los cambios hechos desde la web y desde la API se reflejan en los mismos archivos JSON
- El chat de soporte funciona en tiempo real con Socket.IO
- El sistema es completamente responsivo y accesible
- Todos los endpoints están protegidos según el rol del usuario

## Licencia

[MIT](LICENSE)