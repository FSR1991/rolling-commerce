const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/* Dato importante compara la contraseña ingresada, la vuelve a hasear y compara que ambos hash coincidan  */



module.exports = {
  hashPassword,
  comparePassword,
};