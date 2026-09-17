const express = require("express");

const router = express.Router();

let db;

(async () => {
  const prismaDb = await import("../src/prisma/db.mjs");
  db = prismaDb.db;
})();

router.post("/", async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        message: "Database is still connecting...",
      });
    }

    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Order items are required",
      });
    }

    const order = await db.orm.public.Order.create({
      totalAmount,
      status: "Paid",
    });

    for (const item of items) {
      await db.orm.public.OrderItem.create({
        quantity: item.quantity,
        price: item.price,
        productId: item.productId,
        orderId: order.id,
      });
    }

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Order Error:", error);

    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        message: "Database is still connecting...",
      });
    }

    const orders = await db.orm.public.Order.all();

    res.json(orders);
  } catch (error) {
    console.error("Order Fetch Error:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

module.exports = router;