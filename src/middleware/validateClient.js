function validateClient(req, res, next) {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  next();
}

module.exports = validateClient;