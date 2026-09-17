const dotenv = require("dotenv");

dotenv.config();

async function seed() {
  try {
    const { db } = await import("./src/prisma/db.mjs");

    await db.orm.public.Product.create({
      name: "Wireless Headphones",
      description: "Premium wireless headphones with clear sound.",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      category: "Electronics",
      stock: 25,
    });

    await db.orm.public.Product.create({
      name: "Smart Watch",
      description: "Modern smartwatch for everyday fitness and productivity.",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      category: "Electronics",
      stock: 15,
    });

    await db.orm.public.Product.create({
      name: "Classic Backpack",
      description: "Durable backpack suitable for work and travel.",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
      category: "Accessories",
      stock: 30,
    });

    await db.orm.public.Product.create({
  name: "Classic Sneakers",
  description: "Comfortable everyday sneakers with a modern design.",
  price: 64.99,
  image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  category: "Fashion",
  stock: 20,
});

await db.orm.public.Product.create({
  name: "Premium Hoodie",
  description: "Soft and stylish hoodie perfect for everyday wear.",
  price: 44.99,
  image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
  category: "Fashion",
  stock: 18,
});

    console.log("Products added successfully!");
  } catch (error) {
    console.error("Seed Error:", error);
  }
}

seed();