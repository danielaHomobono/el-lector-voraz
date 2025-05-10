function validateSale(req, res, next) {
  const { items, channel } = req.body;
  if (!items || !items.length || !channel) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  for (const item of items) {
    if (!item.productId || !item.type || !item.quantity || item.quantity < 1) {
      return res.status(400).json({ error: 'Ítems inválidos' });
    }
    if (!['book', 'magazine', 'cafe'].includes(item.type)) {
      return res.status(400).json({ error: 'Tipo de producto inválido' });
    }
  }
  if (!['physical', 'online'].includes(channel)) {
    return res.status(400).json({ error: 'Canal inválido' });
  }
  next();
}

module.exports = validateSale;