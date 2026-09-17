const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { db } = require("./src/prisma/db");

const Stripe = require("stripe");

const app = express();

app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.get("/", (req, res) => {
  res.send("E-Commerce Backend is running");
});

app.post("/api/payment/create-checkout-session", async (req, res) => {
  try {
    const { amount } = req.body;

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
      success_url: "http://localhost:3000/success",
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

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});