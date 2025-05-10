const path = require('path');
const fileService = require('./fileService');

const USERS_FILE = path.resolve(__dirname, '..', 'data', 'users.json');

async function loginUser({ email, password }) {
  console.log('Intentando leer USERS_FILE:', USERS_FILE);
  const users = await fileService.readFile(USERS_FILE);
  console.log('Usuarios leídos:', users);
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Credenciales inválidas');
  }
  return { id: user.id, email: user.email };
}

module.exports = { loginUser };