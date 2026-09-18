const express = require("express");

const router = express.Router();

let db;

(async () => {
  const prismaDb = await import("../src/prisma/db.mjs");
  db = prismaDb.db;
})();

router.get("/", async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        message: "Database is still connecting...",
      });
    }

    const products = await db.orm.public.Product.all();

    res.json(products);
  } catch (error) {
    console.error("Product Error:", error);

    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        message: "Database is still connecting...",
      });
    }

    const product = await db.orm.public.Product.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: req.body.image,
      category: req.body.category,
      stock: req.body.stock,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create Product Error:", error);

    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        message: "Database is still connecting...",
      });
    }

    const id = Number(req.params.id);

    await db.orm.public.Product.delete({
      where: { id },
    });

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
});

module.exports = router;