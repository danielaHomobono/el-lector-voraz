# Instrucciones para los tests 🧪

Este proyecto utiliza **Jest** para realizar pruebas unitarias y de integración.

## ¿Cómo ejecutar los tests?

1. Abre la terminal en la raíz del proyecto.
2. Ejecuta:
   
   ```bash
   npm test
   ```
   Esto ejecutará todos los tests una sola vez.

3. Si quieres que los tests se ejecuten automáticamente al guardar cambios:
   
   ```bash
   npm run test:watch
   ```

4. Para ver un reporte de cobertura:
   
   ```bash
   npm run test:coverage
   ```

## ¿Dónde están los tests?

- Los tests están en la carpeta `__tests__`.
- Hay subcarpetas para tests unitarios (`unit/`), de integración (`integration/`) y mocks (`mocks/`).
- Los archivos terminan en `.test.js`.

## ¿Cómo agregar un nuevo test?

1. Crea un archivo nuevo en la carpeta correspondiente (`unit` o `integration`).
2. Usa la siguiente estructura básica:

   ```js
   describe('Nombre del módulo o función', () => {
     test('debería hacer algo', () => {
       // Arrange
       // Act
       // Assert
     });
   });
   ```
3. Ejecuta los tests para verificar que todo funcione.

## Buenas prácticas

- Asegúrate de que los tests sean claros y fáciles de entender.
- Usa mocks para aislar dependencias externas (por ejemplo, servicios o base de datos).
- Los tests deben ser independientes entre sí.
- Si cambias la lógica del backend, revisa y actualiza los tests afectados.

## ¿Qué hacer si un test falla?

- Lee el mensaje de error en la terminal.
- Verifica si el test está desactualizado o si hay un bug en el código.
- Corrige el test o el código según corresponda y vuelve a ejecutar los tests.

---

¿Dudas? ¡Pregunta a tu equipo o revisa la documentación de Jest! 