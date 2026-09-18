import postgres from "@prisma/orm-postgres/runtime";
import contractJson from "./src/prisma/contract.json" with { type: "json" };
import dotenv from "dotenv";

dotenv.config();

const db = postgres({
  contractJson,
  url: process.env.DATABASE_URL,
});

const products = [
  {
    name: "Premium Headphones",
    description: "High quality wireless headphones",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    category: "Electronics",
    stock: 20,
  },
  {
    name: "Smart Watch",
    description: "Modern smartwatch with fitness tracking",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    category: "Electronics",
    stock: 15,
  },
  {
    name: "Casual Sneakers",
    description: "Comfortable everyday sneakers",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    category: "Fashion",
    stock: 25,
  },
  {
    name: "Leather Backpack",
    description: "Stylish and durable leather backpack",
    price: 44.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    category: "Accessories",
    stock: 18,
  },
];

for (const product of products) {
  await db.orm.public.Product.create(product);
}

console.log("Products added successfully!");

console.log("Products added successfully!");