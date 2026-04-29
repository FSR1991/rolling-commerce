import User from "../models/users.js";
import generateToken from "../utils/generateToken.js";

const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({
    $or: [{ email: normalizedEmail }, { name }],
  });

  if (existingUser) {
    if (existingUser.email === normalizedEmail) {
      throw new Error("El email ya está registrado");
    }

    if (existingUser.name === name) {
      throw new Error("El nombre ya está en uso");
    }
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
  });

  return user.toPublicJSON();
};

const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  if (!user.isActive) {
    throw new Error("Tu cuenta está desactivada");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error("Credenciales inválidas");
  }

  const token = generateToken(user);

  return {
    token,
    user: user.toPublicJSON(),
  };
};

export { registerUser, loginUser };
