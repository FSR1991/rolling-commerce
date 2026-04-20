// MÓDULO: Users
// Todas las rutas requieren token JWT — header: Authorization: Bearer <token>
// protect  → verifica token y carga req.user
// admin    → verifica que req.user.role === "admin", siempre después de protect
import express from "express";
import { createUser, getUsers, getUserById,updateUser, deleteUser, getMe } from "../controllers/usersControllers.js";
import { protect, admin } from "../middlewares/authMiddlewares.js";


const router = express.Router();
// Registro deshabilitado — lo maneja el equipo de Auth en /api/auth/register.
// router.post("/", protect, admin, createUser);;

router.get("/me", protect, getMe);

router.get("/admin", protect, admin, (req, res) => {
  res.json({ message: "Ruta de admin OK" });
});

router.get("/",protect, admin, getUsers);

router.get("/:id", protect, getUserById);

router.put("/:id", protect, updateUser);

router.delete("/:id", protect, deleteUser);



export default router;