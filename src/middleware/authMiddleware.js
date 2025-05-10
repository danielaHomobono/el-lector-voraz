const dotenv = require('dotenv');
dotenv.config();

function authMiddleware(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Clave API inválida' });
  }
  next();
}

module.exports = authMiddleware;