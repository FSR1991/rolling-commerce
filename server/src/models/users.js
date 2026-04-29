// MÓDULO: Users
// Modelo de usuario para la base de datos.
// Campos editables desde userControllers: name, email, password, role (solo admin).
// El password se hashea automáticamente antes de cada save mediante el pre-hook.
// comparePassword es usado por el equipo de Auth en authControllers.js para validar login.
// isActive: false = eliminación lógica, el usuario no se borra físicamente de la DB.
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});
// Hash automático del password. Solo se ejecuta si el campo password fue modificado.
// NO tocar — el equipo de Auth depende de esto para el login.
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
// Método usado por Auth para comparar el password ingresado con el hash guardado.
// NO tocar — pertenece al flujo de login del equipo de Auth.
userSchema.methods.comparePassword = async function (passwordingresada) {
  return await bcrypt.compare(passwordingresada, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;