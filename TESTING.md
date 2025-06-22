# Estrategia de Pruebas - El Lector Voraz

Este documento describe la estrategia de pruebas implementada en el proyecto El Lector Voraz.

## Enfoque de Pruebas

El proyecto utiliza un enfoque de pruebas en múltiples niveles:

1. **Pruebas Unitarias**: Verifican el funcionamiento correcto de componentes individuales aislados.
2. **Pruebas de Integración**: Verifican la interacción correcta entre componentes.
3. **Pruebas Manuales**: Complementan las pruebas automatizadas para verificar la experiencia de usuario.

## Herramientas de Prueba

- **Jest**: Framework de pruebas para JavaScript
- **Supertest**: Biblioteca para pruebas de API HTTP
- **Mocks**: Simulación de dependencias para pruebas aisladas

## Estructura de Pruebas

```
__tests__/
├── integration/       # Pruebas de integración
│   └── auth.test.js   # Pruebas de rutas de autenticación
├── mocks/             # Datos de prueba
│   └── data.js        # Datos mock para pruebas
└── unit/              # Pruebas unitarias
    ├── authMiddleware.test.js    # Pruebas de middleware de autenticación
    ├── errorHandler.test.js      # Pruebas de manejo de errores
    ├── jwt.test.js               # Pruebas de utilidades JWT
    ├── validationMiddleware.test.js  # Pruebas de middleware de validación
    └── validator.test.js         # Pruebas de utilidades de validación
```

## Componentes Probados

### Utilidades
- **Validador**: Funciones para validar datos de entrada
- **JWT**: Funciones para generar y verificar tokens JWT
- **Manejo de Errores**: Funciones para manejar errores de forma consistente

### Middleware
- **Autenticación**: Middleware para verificar API keys y roles de usuario
- **Validación**: Middleware para validar datos de solicitudes

### Rutas
- **Autenticación**: Rutas para inicio y cierre de sesión

## Cobertura de Pruebas

Las pruebas se centran en los componentes críticos del sistema:

1. **Seguridad**: Autenticación, autorización y validación de datos
2. **Lógica de Negocio**: Validación de reglas de negocio
3. **Manejo de Errores**: Respuestas adecuadas ante errores

## Ejecución de Pruebas

### Comandos Disponibles

- `npm test`: Ejecuta todas las pruebas
- `npm run test:watch`: Ejecuta pruebas en modo observador (útil durante desarrollo)
- `npm run test:coverage`: Ejecuta pruebas y genera informe de cobertura
- `node run-test.js <ruta-archivo>`: Ejecuta un archivo de prueba específico

### Configuración

La configuración de Jest se encuentra en `jest.config.js` y `jest.setup.js`.

## Pruebas Manuales

Se ha creado un documento de pruebas manuales (`MANUAL_TESTS.md`) que describe los procedimientos para verificar manualmente las funcionalidades críticas del sistema.

## Mejores Prácticas Implementadas

1. **Aislamiento**: Las pruebas unitarias utilizan mocks para aislar el código probado
2. **Organización**: Las pruebas están organizadas por tipo y componente
3. **Descriptivas**: Los nombres de las pruebas describen claramente lo que se está probando
4. **Cobertura**: Se priorizan los componentes críticos para la seguridad y funcionalidad
5. **Mantenibilidad**: Las pruebas son fáciles de entender y mantener