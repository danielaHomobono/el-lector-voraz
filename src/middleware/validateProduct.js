const validateProduct = (req, res, next) => {
  const { type, price, stock, category, title, author, isbn, name } = req.body;

  if (!type || !price || !stock || !category) {
    return res.status(400).json({ error: 'Faltan campos requeridos: type, price, stock o category' });
  }

  if (typeof price !== 'number' || typeof stock !== 'number') {
    return res.status(400).json({ error: 'price y stock deben ser números' });
  }

  if (type === 'book') {
    if (!title || !author || !isbn) {
      return res.status(400).json({ error: 'Faltan campos requeridos para "book": title, author, isbn' });
    }
  }

  if (type === 'cafe') {
    if (!name) {
      return res.status(400).json({ error: 'Falta el campo "name" para producto tipo "cafe"' });
    }
  }

  next();
};

module.exports = validateProduct;
