const User = require('../models/users');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken');

const registerUser = async ({ username, email, password }) => {
const existingUser = await User.findOne({
  $or: [{ email }, { username }],
});

if (existingUser) {
  if (existingUser.email === email) {
    throw new Error('El email ya está registrado');
  }

  if (existingUser.username === username) {
    throw new Error('El nombre de usuario ya está en uso');
  }
}

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  return user.toPublicJSON();
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password'); /* password solicitado explicitamente retorna con undefined por el campo select false  */

  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  if (!user.isActive) {
    throw new Error('Tu cuenta está desactivada');
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new Error('Credenciales inválidas');
  }

  const token = generateToken(user);

  return {
    token,
    user: user.toPublicJSON(),
  };
};

module.exports = {
  registerUser,
  loginUser,
};