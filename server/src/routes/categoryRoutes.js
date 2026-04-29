import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Category endpoint available" });
});

router.get("/:id", (req, res) => {
  res.status(200).json({ message: "Category detail endpoint available" });
});

export default router;
