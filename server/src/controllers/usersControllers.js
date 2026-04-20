// MÓDULO: Users
// Controllers disponibles y sus rutas:
// getMe        → GET  /api/users/me         (usuario logueado)
// getUsers     → GET  /api/users            (solo admin)
// getUserById  → GET  /api/users/:id        (usuario propio o admin)
// updateUser   → PUT  /api/users/:id        (usuario propio o admin)
// deleteUser   → DELETE /api/users/:id      (usuario propio o admin — eliminación lógica)
//
// createUser está implementado pero deshabilitado — registro lo maneja el equipo de Auth.
// NUNCA devolver el campo password en ninguna respuesta.
import mongoose from "mongoose";
import User from "../models/users.js";
// DESHABILITADO — el registro de usuarios lo maneja el equipo de Auth.
// La ruta POST /api/users está comentada en userRoutes.js.
// No eliminar — puede ser útil internamente en el futuro.
export const createUser = async (req, res) => {
   
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
         message: "faltan datos",
         body: req.body,
         });
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
        return res.status(400).json({ message: "El usuario ya existe" });
    }
    
    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
// Lista todos los usuarios activos. Solo accesible por admin.
// No devuelve el campo password (.select("-password")).
export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      total: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "error getting users" });
  }
};
// Devuelve un usuario por ID.
// Acceso permitido: el propio usuario o un admin.
// Usuarios con isActive === false se tratan como inexistentes (404).
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const user = await User.findById(id).select("-password");

    if (!user || user.isActive === false) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      req.user.role !== "admin" &&
      String(req.user._id) !== id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(user);

  } catch (error) {
    console.error(`[getUserById] id=${req.params.id}`, error);
    res.status(500).json({ message: "Error getting user" });
  }
};
// Actualiza name, email y/o password del usuario.
// Solo admin puede cambiar el campo role.
// Valida que el nuevo email no esté en uso por otra cuenta.
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const user = await User.findById(id);

    if (!user || user.isActive === false) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (
      req.user.role !== "admin" &&
      String(req.user._id) !== id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (name) user.name = name;

    if (email) {
      const emailExist = await User.findOne({ email, _id: { $ne: id } });
      if (emailExist) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    if (password) user.password = password;

    if (role && req.user.role === "admin") {
      user.role = role;
    }
// Actualiza name, email y/o password del usuario.
// Solo admin puede cambiar el campo role.
// Valida que el nuevo email no esté en uso por otra cuenta.
    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
    });

  } catch (error) {
    console.error(`[updateUser] id=${req.params.id}`, error);
    res.status(500).json({ message: "Error al actualizar usuario", 
    error: error.message  
    });
  }
};
// Eliminación lógica — pone isActive en false, no borra el documento de la DB.
// Acceso permitido: el propio usuario o un admin.
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const user = await User.findById(id);

    if (!user || user.isActive === false) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      req.user.role !== "admin" &&
      String(req.user._id) !== id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      message: "User deactivated correctly",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });

  } catch (error) {
    console.error(`[deleteUser] id=${req.params.id}`, error);
    res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
};

// Devuelve el perfil del usuario logueado desde req.user.
// req.user ya viene sin password gracias al middleware protect.

export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json(req.user);

  } catch (error) {
    console.error("[getMe]", error);
    res.status(500).json({ message: "Error getting profile" });
  }
};