// Controllers disponibles y sus rutas:
// createOrder       → POST   /api/orders
// getOrders         → GET    /api/orders
// getOrderById      → GET    /api/orders/:id
// updateOrderStatus → PUT    /api/orders/:id/status/
// El carrito se vacía automáticamente al crear una orden exitosa.
// Los precios se copian del carrito al momento de la compra — son históricos.
// Para integrar pagos: updateOrderStatus recibe { status: "paid" } desde el webhook.

import mongoose from "mongoose";
import Order from "../models/order.js";
import Cart from "../models/cart.js";

// Crea una orden a partir del carrito del usuario logueado.
// Copia los items y precios del carrito, calcula el total y vacía el carrito.
export const createOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = cart.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const total = parseFloat(
      items
        .reduce((acc, item) => acc + item.price * item.quantity, 0)
        .toFixed(2)
    );

    const order = await Order.create({
      userId: req.user._id,
      items,
      total,
      status: "pending",
    });

    // Vaciar carrito después de crear la orden exitosamente
    cart.items = [];
    await cart.save();

    res.status(201).json(order);

  } catch (error) {
    console.error("[createOrder]", error);
    res.status(500).json({ message: "Error creating order" });
  }
};

// Lista todas las órdenes del usuario logueado, de más reciente a más antigua.
export const getOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      total: orders.length,
      orders,
    });

  } catch (error) {
    console.error("[getOrders]", error);
    res.status(500).json({ message: "Error getting orders" });
  }
};

// Devuelve el detalle de una orden por ID.
// Acceso permitido: el dueño de la orden o un admin.
export const getOrderById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      req.user.role !== "admin" &&
      String(order.userId) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(order);

  } catch (error) {
    console.error(`[getOrderById] id=${req.params.id}`, error);
    res.status(500).json({ message: "Error getting order" });
  }
};

// Actualiza el estado de una orden. Solo accesible por admin.
// Estados válidos: pending, paid, cancelled, delivered.
// Para integrar pagos: llamar a este endpoint desde el webhook de MercadoPago con status "paid".
export const updateOrderStatus = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    const validStatuses = ["pending", "paid", "cancelled", "delivered"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);

  } catch (error) {
    console.error(`[updateOrderStatus] id=${req.params.id}`, error);
    res.status(500).json({ message: "Error updating order status" });
  }
};