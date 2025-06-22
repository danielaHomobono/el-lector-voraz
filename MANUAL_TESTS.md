# Pruebas Manuales - El Lector Voraz

Este documento describe los procedimientos para realizar pruebas manuales en las funcionalidades críticas de la aplicación.

## Pruebas de Autenticación

### Inicio de Sesión
1. Navegar a la página de inicio de sesión (`/login`)
2. Probar inicio de sesión con credenciales válidas:
   - Email: `admin@lectorvoraz.com`
   - Contraseña: `admin123`
   - Verificar redirección a `/inventory`
3. Probar inicio de sesión con credenciales inválidas:
   - Email: `admin@lectorvoraz.com`
   - Contraseña: `contraseña-incorrecta`
   - Verificar mensaje de error
4. Probar inicio de sesión con campos vacíos:
   - Verificar validación de formulario

### Cierre de Sesión
1. Iniciar sesión con credenciales válidas
2. Hacer clic en "Cerrar sesión"
3. Verificar redirección a `/login`
4. Intentar acceder a una página protegida (ej. `/inventory`)
5. Verificar redirección a `/login`

## Pruebas de Control de Acceso

### Acceso de Administrador
1. Iniciar sesión como administrador
2. Verificar acceso a todas las secciones:
   - `/inventory` (Inventario)
   - `/cafes` (Stock Café)
   - `/clients` (Clientes)
   - `/sales` (Ventas)
   - `/users` (Usuarios)
   - `/financial` (Reportes)

### Acceso de Staff
1. Iniciar sesión como staff:
   - Email: `staff@lectorvoraz.com`
   - Contraseña: `staff123`
2. Verificar acceso a:
   - `/products` (Catálogo)
   - `/inventory` (Inventario)
   - `/cafes` (Cafetería)
   - `/sales` (Ventas)
3. Verificar que NO tiene acceso a:
   - `/users` (Usuarios)
   - `/financial` (Reportes)

### Acceso de Cliente
1. Iniciar sesión como cliente:
   - Email: `user@lectorvoraz.com`
   - Contraseña: `user123`
2. Verificar acceso a:
   - `/products` (Catálogo)
   - `/cafes` (Cafetería)
   - `/cart` (Carrito)
3. Verificar que NO tiene acceso a:
   - `/inventory` (Inventario)
   - `/sales` (Ventas)
   - `/users` (Usuarios)

## Pruebas de Gestión de Inventario

### Agregar Producto
1. Iniciar sesión como administrador
2. Navegar a `/inventory`
3. Hacer clic en "Agregar Libro"
4. Completar el formulario con datos válidos:
   - Título: "Libro de Prueba"
   - Autor: "Autor de Prueba"
   - ISBN: "9788497592208"
   - Precio: "19.99"
   - Stock: "10"
   - Categoría: "Novela"
5. Hacer clic en "Guardar"
6. Verificar que el libro aparece en la lista

### Editar Producto
1. En la lista de productos, encontrar "Libro de Prueba"
2. Hacer clic en el botón "Editar"
3. Modificar el precio a "24.99"
4. Hacer clic en "Guardar"
5. Verificar que el precio se actualizó correctamente

### Eliminar Producto
1. En la lista de productos, encontrar "Libro de Prueba"
2. Hacer clic en el botón "Eliminar"
3. Confirmar la eliminación
4. Verificar que el libro ya no aparece en la lista

## Pruebas de Carrito de Compras

### Agregar al Carrito
1. Iniciar sesión como cliente
2. Navegar a `/products`
3. Hacer clic en "Agregar al carrito" en un libro
4. Verificar notificación de éxito
5. Verificar que el contador del carrito se incrementa

### Ver Carrito
1. Hacer clic en "Carrito" en la barra de navegación
2. Verificar que el producto agregado aparece en el carrito
3. Verificar que el precio total es correcto

### Modificar Cantidad
1. En el carrito, cambiar la cantidad del producto a 2
2. Verificar que el precio total se actualiza correctamente

### Eliminar del Carrito
1. Hacer clic en "Eliminar" en un producto del carrito
2. Verificar que el producto se elimina
3. Verificar que el precio total se actualiza correctamente

## Pruebas de Checkout

### Proceso de Checkout
1. Agregar productos al carrito
2. Navegar al carrito
3. Hacer clic en "Proceder al pago"
4. Completar el formulario de checkout:
   - Método de pago: "efectivo"
5. Hacer clic en "Confirmar compra"
6. Verificar redirección a página de confirmación
7. Verificar que el carrito está vacío

## Pruebas de Chat de Soporte

### Cliente Inicia Chat
1. Iniciar sesión como cliente
2. Navegar a `/chat`
3. Escribir un mensaje y enviarlo
4. Verificar que el mensaje aparece en el chat

### Staff Responde Chat
1. Iniciar sesión como staff en otra ventana/navegador
2. Navegar a `/support`
3. Verificar que aparece el cliente conectado
4. Hacer clic en el cliente
5. Responder al mensaje
6. Verificar que el mensaje aparece en el chat del cliente

## Pruebas de Tema Claro/Oscuro

### Cambio de Tema
1. Iniciar sesión con cualquier usuario
2. Verificar que el tema predeterminado es claro
3. Hacer clic en el botón de cambio de tema en la barra de navegación
4. Verificar que el tema cambia a oscuro
5. Recargar la página
6. Verificar que el tema oscuro persiste
7. Hacer clic nuevamente en el botón de cambio de tema
8. Verificar que el tema vuelve a claro

## Pruebas de Responsividad

### Dispositivo Móvil
1. Abrir las herramientas de desarrollo del navegador
2. Activar el modo de dispositivo móvil
3. Verificar que la interfaz se adapta correctamente:
   - Menú de navegación se colapsa
   - Elementos se apilan verticalmente
   - Formularios son usables
4. Probar la funcionalidad principal en vista móvil

### Tablet
1. Cambiar a dimensiones de tablet
2. Verificar que la interfaz se adapta correctamente
3. Probar la funcionalidad principal en vista tablet

## Pruebas de Accesibilidad

### Navegación por Teclado
1. Usar la tecla Tab para navegar por la interfaz
2. Verificar que todos los elementos interactivos son accesibles
3. Verificar que el foco visual es claro y visible

### Lectores de Pantalla
1. Activar un lector de pantalla (VoiceOver en macOS, NVDA en Windows)
2. Navegar por la aplicación
3. Verificar que los elementos tienen etiquetas descriptivas
4. Verificar que los formularios tienen etiquetas asociadas correctamente