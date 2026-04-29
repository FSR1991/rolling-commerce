import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productsController.js";

const router = express.Router();

//Rutas públicas
router.get("/", getProducts);
router.get("/:id", getProductById);

//Rutas privadas
//TODO: Agregar auth middleware
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
