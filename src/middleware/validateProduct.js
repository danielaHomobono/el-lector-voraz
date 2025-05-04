const validateProduct = (req, res, next) => {
    const { type, price, stock, category } = req.body;
    if (!type || !price || !stock || !category) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    if (type === 'book' && (!req.body.title || !req.body.author || !req.body.isbn)) {
      return res.status(400).json({ error: 'Faltan campos requeridos para libro' });
    }
    if (type === 'cafe' && !req.body.name) {
      return res.status(400).json({ error: 'Falta nombre para producto de café' });
    }
    if (typeof price !== 'number' || typeof stock !== 'number') {
      return res.status(400).json({ error: 'Tipos de datos inválidos' });
    }
    next();
  };
  
  module.exports = validateProduct;