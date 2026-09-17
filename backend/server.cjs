const express = require("express");
const cors = require("cors");
require("dotenv").config();

const Stripe = require("stripe");
const productRoutes = require("./routes/productRoutes.cjs");
const orderRoutes = require("./routes/orderRoutes.cjs");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.get("/", (req, res) => {
  res.send("E-Commerce Backend is running");
});

app.post("/api/payment/create-checkout-session", async (req, res) => {
  try {
    const { amount, items } = req.body;

    if (!amount || !items || items.length === 0) {
      return res.status(400).json({
        message: "Cart items are required",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",

            product_data: {
              name: "E-Commerce Order",
            },

            unit_amount: Math.round(amount * 100),
          },

          quantity: 1,
        },
      ],

      metadata: {
        items: JSON.stringify(items),
        totalAmount: String(amount),
      },

      success_url:
        "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",

      cancel_url: "http://localhost:3000/cart",
    });

    res.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Error:", error);

    res.status(500).json({
      message: "Payment session creation failed",
    });
  }
});

app.get("/api/orders/confirm", async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({
        message: "Session ID is required",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        message: "Payment has not been completed",
      });
    }

    const items = JSON.parse(session.metadata.items);
    const totalAmount = Number(session.metadata.totalAmount);

    const { db } = await import("./src/prisma/db.mjs");

    // Check if this Stripe payment already created an order
    const existingOrder =
      await db.orm.public.Order.findUnique({
        where: {
          stripeSessionId: session.id,
        },
      });

    if (existingOrder) {
      return res.json({
        message: "Order already exists",
        order: existingOrder,
      });
    }

    // Create new order
    const order = await db.orm.public.Order.create({
      totalAmount,
      status: "Paid",
      stripeSessionId: session.id,
    });

    // Create order items
    for (const item of items) {
      await db.orm.public.OrderItem.create({
        quantity: item.quantity,
        price: item.price,
        productId: item.productId,
        orderId: order.id,
      });
    }

    res.json({
      message: "Payment verified and order created successfully",
      order,
    });
  } catch (error) {
    console.error("Order Confirmation Error:", error);

    res.status(500).json({
      message: "Failed to confirm order",
      error: error.message,
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});