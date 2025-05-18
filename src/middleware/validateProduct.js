function validateProduct(req, res, next) {
  const { type, title, price, stock, category, author, isbn } = req.body;
  if (!type || !title || !price || !stock || !category) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  if (type === 'book' && (!author || !isbn)) {
    return res.status(400).json({ error: 'Autor e ISBN requeridos para libros' });
  }
  if (price < 0 || stock < 0) {
    return res.status(400).json({ error: 'Precio y stock deben ser no negativos' });
  }
  next();
}

module.exports = validateProduct;