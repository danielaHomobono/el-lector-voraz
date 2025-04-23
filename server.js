const express = require('express');
const dotenv = require('dotenv');

// Cargar variables de entorno desde .env
dotenv.config();

const app = express();


app.use(express.json());


// Iniciar el servidor en el puerto definido en .env o 3000 por defecto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
app.get('/', (req, res) => {
    res.send('¡Hola, Tech Moms 2.0!');
  });
  