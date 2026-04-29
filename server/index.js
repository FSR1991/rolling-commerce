import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
// import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";

dotenv.config();

const app = express();


// middlewares
app.use(cors());
app.use(express.json());
//rutas
// app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/orders", orderRoutes);


//ruta base
app.get("/", (req, res) => {
  res.send("API funcionando");
});

//servidor
const PORT = process.env.PORT || 3000;
connectDB().then(() => {
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  });
});