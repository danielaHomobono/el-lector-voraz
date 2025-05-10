

class User {
  constructor({ id, email, password }) {
    if (!email || !password) throw new Error('Faltan campos requeridos');
    this.id = id;
    this.email = email;
    this.password = password; // Texto plano (mejorar en segunda entrega)
  }

  verifyPassword(password) {
    return this.password === password;
  }
}

module.exports = User;