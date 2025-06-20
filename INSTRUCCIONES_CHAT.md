# Instrucciones para Probar el Chat de Soporte

## Estado Actual
El servidor está funcionando en `http://localhost:3000` y el sistema de chat está implementado con Socket.IO.

## Problemas Identificados y Solucionados

### 1. Problema: Los mensajes del cliente no se mostraban en el chat
**Solución:** Se corrigió el CSS para asegurar que el contenedor de mensajes tenga la altura correcta y sea visible.

### 2. Problema: Los clientes no aparecían en el panel de soporte
**Solución:** Se agregaron logs de depuración y se mejoró el manejo de datos del usuario.

### 3. Problema: Los datos del usuario no se pasaban correctamente
**Solución:** Se mejoró la función `loadUserInfo()` para manejar tanto objetos como strings JSON.

## Cómo Probar el Chat

### Paso 1: Iniciar el Servidor
```bash
npm run dev
```
El servidor debe estar corriendo en `http://localhost:3000`

### Paso 2: Probar como Cliente
1. Abrir una ventana normal del navegador
2. Ir a `http://localhost:3000/login`
3. Iniciar sesión como cliente:
   - Email: `roma@gmail.com`
   - Contraseña: `123456`
4. Una vez logueado, hacer clic en "Chat de Soporte" en el menú
5. Escribir un mensaje y hacer clic en enviar
6. Verificar que el mensaje aparezca en el chat

### Paso 3: Probar como Admin/Staff
1. Abrir una ventana incógnita del navegador (o usar otro navegador)
2. Ir a `http://localhost:3000/login`
3. Iniciar sesión como admin:
   - Email: `admin1@lectorvoraz.com`
   - Contraseña: `123456`
4. Una vez logueado, hacer clic en "Panel de Soporte" en el menú
5. Verificar que aparezca el cliente conectado en la lista
6. Hacer clic en el cliente para seleccionarlo
7. Escribir una respuesta y enviarla
8. Verificar que la respuesta llegue al cliente

### Paso 4: Verificar la Comunicación Bidireccional
1. En la ventana del cliente, escribir otro mensaje
2. Verificar que aparezca en el panel de soporte
3. En el panel de soporte, responder al mensaje
4. Verificar que la respuesta llegue al cliente

## Logs de Depuración

### En el Navegador (F12 -> Console)
- **Cliente:** Verás logs como:
  - "Conectado al servidor de chat"
  - "Datos del usuario cargados: {...}"
  - "Enviando información de cliente: {...}"
  - "Enviando mensaje: ..."

- **Soporte:** Verás logs como:
  - "Panel de soporte conectado"
  - "Datos del usuario de soporte cargados: {...}"
  - "Recibida actualización de clientes: {...}"
  - "Mensaje recibido de cliente: {...}"

### En el Servidor (Terminal)
- "Nueva conexión Socket.IO: ..."
- "Cliente conectado: ..."
- "Soporte conectado: ..."
- "Mensaje de cliente: ..."
- "Mensaje de soporte: ..."

## Solución de Problemas

### Si los mensajes no aparecen:
1. Verificar que el servidor esté corriendo
2. Abrir la consola del navegador (F12) y revisar los logs
3. Verificar que no haya errores de JavaScript
4. Asegurarse de que ambos usuarios estén logueados

### Si los clientes no aparecen en el panel de soporte:
1. Verificar que el cliente esté conectado al chat
2. Revisar los logs del servidor para ver si se registró la conexión
3. Verificar que el admin/staff esté logueado correctamente

### Si hay errores de conexión:
1. Verificar que el puerto 3000 no esté ocupado
2. Reiniciar el servidor con `npm run dev`
3. Limpiar la caché del navegador

## Funcionalidades Implementadas

✅ **Chat en tiempo real** - Los mensajes se envían instantáneamente
✅ **Identificación de roles** - Clientes y soporte se identifican correctamente
✅ **Indicadores de estado** - Muestra si está conectado/desconectado
✅ **Contador de caracteres** - Limita mensajes a 500 caracteres
✅ **Auto-resize del textarea** - Se ajusta automáticamente
✅ **Respuestas rápidas** - Botones con respuestas predefinidas
✅ **Notificaciones** - Alertas cuando llegan mensajes nuevos
✅ **Interfaz responsiva** - Funciona en móviles y desktop

## Próximos Pasos

Si todo funciona correctamente, puedes:
1. Personalizar las respuestas rápidas
2. Agregar más funcionalidades como archivos adjuntos
3. Implementar historial de chats
4. Agregar emojis y formato de texto 