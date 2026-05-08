import { MercadoPagoConfig, Preference } from "mercadopago";
import dotenv from "dotenv";

dotenv.config();

const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN,
});

export const createPreference = async (items, backUrls = {}) => {
  const preference = new Preference(client);
  try {
    const response = await preference.create({
      body: {
        items: items.map(item => ({
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: item.currency_id || "ARS",
          description: item.description || "",
          category: item.category || "",
          id: item.id || "",
        })),
        back_urls: {
          success: backUrls.success || "http://localhost:5173/success",
          failure: backUrls.failure || "http://localhost:5173/failure",
          pending: backUrls.pending || "http://localhost:5173/pending",
        },
      },
    });
    return response.id;
  } catch (error) {
    console.error("Error creating MercadoPago preference:", error);
    throw new Error("Error al crear la preferencia");
  }
};