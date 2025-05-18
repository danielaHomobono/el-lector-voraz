const API_KEY = 'secret-key-123';

function verifyApiKey(req, res, next) {
  // En desarrollo, permitir acceso sin API key
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }
  
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Clave API inválida' });
  }
  next();
}

function restrictToAdmin(req, res, next) {
  console.log('restrictToAdmin: req.user =', req.user);
  const user = req.user;
  if (!user || user.role !== 'admin') {
    console.log('Acceso denegado: user =', user);
    return res.status(403).json({ error: 'Acceso denegado: se requiere rol de administrador' });
  }
  next();
}

module.exports = { verifyApiKey, restrictToAdmin };