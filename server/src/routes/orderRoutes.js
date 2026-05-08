// Todas las rutas requieren token JWT — header: Authorization: Bearer <token>
// protect  → verifica token y carga req.user
// admin    → verifica que req.user.role === "admin", siempre después de protect/
// Endpoints:
// POST   /api/orders               → crea orden desde el carrito
// GET    /api/orders               → lista órdenes del usuario logueado
// GET    /api/orders/:id           → detalle de una orden (usuario propio o admin)
// PUT    /api/orders/:id/status    → actualiza estado (solo admin)

import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, admin } from "../middlewares/authMiddlewares.js";
import { createPreference } from "../../mercadopago.js";

const router = express.Router();

router.post("/", protect, createOrder);

router.get("/", protect, getOrders);

router.get("/:id", protect, getOrderById);

router.put("/:id/status", protect, admin, updateOrderStatus);

// Nueva ruta para crear preferencia de MercadoPago
router.post("/create-preference", protect, async (req, res) => {
  try {
    const { items, backUrls } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }
    const preferenceId = await createPreference(items, backUrls);
    res.json({ preferenceId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;