import mongoose from "mongoose";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");
// Usar un DNS público para consultas SRV de MongoDB Atlas
dns.setServers(["8.8.8.8", "1.1.1.1"]);

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB successfully");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("Mongoose disconnected from DB");
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
  } catch (error) {
    console.error("Critical error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
