// MÓDULO: Cart
// Modelo del carrito de compras. Un carrito por usuario (unique: true en userId).
// Los items guardan name y price al momento de agregar — si el precio del producto
// cambia después, el carrito no se ve afectado.
// Para conectar con Orders: usar cart.items y cart.userId al generar una orden.
import mongoose from "mongoose";
// Schema de cada producto dentro del carrito.
// _id: false — los items no necesitan ID propio.
// productId referencia al modelo Product del equipo de productos.
const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false }
);
// Schema principal del carrito.
// userId referencia al modelo User — un carrito por usuario.
// timestamps: true genera createdAt y updatedAt automáticamente.
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;