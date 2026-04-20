// MÓDULO: Cart
// Todas las rutas requieren token JWT — header: Authorization: Bearer <token>
// El carrito se asocia automáticamente al usuario del token — no se pasa userId en la URL.
// Para conectar con Orders: consumir GET /api/cart antes de crear una orden.
import express from "express";
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
} from "../controllers/cartControllers.js";
import { protect } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/", protect, getCart);

router.post("/add", protect, addItem);

router.put("/item/:productId", protect, updateItem);

router.delete("/clear", protect, clearCart);

router.delete("/item/:productId", protect, removeItem);

export default router;