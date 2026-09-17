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

module.exports = router;