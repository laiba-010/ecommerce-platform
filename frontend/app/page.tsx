"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  category: string | null;
  stock: number;
};

const getProductIcon = (product: Product) => {
  if (product.name.toLowerCase().includes("headphone")) {
    return "🎧";
  }

  if (product.name.toLowerCase().includes("watch")) {
    return "⌚";
  }

  if (product.name.toLowerCase().includes("sneaker")) {
    return "👟";
  }

  if (product.name.toLowerCase().includes("hoodie")) {
    return "👕";
  }

  if (product.name.toLowerCase().includes("backpack")) {
    return "🎒";
  }

  return "🛍️";
};

export default function Home() {
  const [cart, setCart] = useState<number[]>(() => {
  if (typeof window === "undefined") {
    return [];
  }

  const savedCart = localStorage.getItem("shopease-cart");

  return savedCart ? JSON.parse(savedCart) : [];
});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  const fetchProducts = async () => {
    try {
    
      const response = await fetch(
  "https://ecommerce-platform-cw8q0k2sl-task-flow-8fca.vercel.app/api/products"
);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Product Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);

useEffect(() => {
  localStorage.setItem("shopease-cart", JSON.stringify(cart));
}, [cart]);

  const addToCart = (productId: number) => {
    setCart((currentCart) => [...currentCart, productId]);
  };

  const removeFromCart = (productId: number) => {
    setCart((currentCart) => {
      const index = currentCart.indexOf(productId);

      if (index === -1) {
        return currentCart;
      }

      return currentCart.filter((_, i) => i !== index);
    });
  };

  const categories = ["All", "Electronics", "Fashion", "Accessories"];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        (product.description ?? "").toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const cartItems = products
    .map((product) => {
      const quantity = cart.filter(
        (id) => id === product.id
      ).length;

      return {
        ...product,
        quantity,
      };
    })
    .filter((product) => product.quantity > 0);

  const total = cartItems.reduce(
    (sum, product) =>
      sum + product.price * product.quantity,
    0
  );

  const checkout = async () => {
    if (total <= 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      const response = await fetch(
        "https://ecommerce-platform-cw8q0k2sl-task-flow-8fca.vercel.app/api/payment/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
  amount: total,
  items: cartItems.map((item) => ({
    productId: item.id,
    quantity: item.quantity,
    price: item.price,
  })),
}),
        }
      );

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Unable to create checkout session.");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Something went wrong with checkout.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

          <a
            href="#"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">
              S
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                ShopEase
              </h1>

              <p className="text-xs text-slate-500">
                Smart shopping, simplified.
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <a
  href="/orders"
  className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
>
  Orders
</a>
            <a
              href="#"
              className="text-sm font-medium text-blue-600"
            >
              Home
            </a>

            <a
              href="#products"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Products
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              About
            </a>
          </div>

          <a
            href="#cart"
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            <span>🛒</span>
            <span>Cart</span>

            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-slate-900">
              {cart.length}
            </span>
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="overflow-hidden bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">

          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              ✨ Curated products for everyday life
            </div>

            <h2 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-slate-950 md:text-6xl">
              Shop smarter.
              <br />
              <span className="text-blue-600">
                Live better.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Discover quality products across electronics
              and fashion, all in one simple shopping
              experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#products"
                className="rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
              >
                Explore Products
              </a>

              <a
                href="#cart"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
              >
                View Cart
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-8 border-t border-slate-200 pt-7">
              <div>
                <p className="text-xl font-bold">100%</p>
                <p className="text-sm text-slate-500">
                  Secure Checkout
                </p>
              </div>

              <div>
                <p className="text-xl font-bold">Fast</p>
                <p className="text-sm text-slate-500">
                  Simple Shopping
                </p>
              </div>

              <div>
                <p className="text-xl font-bold">24/7</p>
                <p className="text-sm text-slate-500">
                  Online Access
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-100 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-100 blur-3xl" />

            <div className="relative rounded-3xl border border-slate-200 bg-slate-100 p-5 shadow-2xl">
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-white">

                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                    Featured Collection
                  </span>

                  <span className="text-2xl">
                    ✦
                  </span>
                </div>

                <div className="flex h-72 items-center justify-center">
                  <span className="text-[130px] drop-shadow-2xl">
                    🎧
                  </span>
                </div>

                <div>
                  <p className="text-sm text-blue-100">
                    Electronics
                  </p>

                  <h3 className="mt-1 text-2xl font-bold">
                    Premium Headphones
                  </h3>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      $49.99
                    </span>

                    <span className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700">
                      Shop now
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* PRODUCTS */}
      <section
        id="products"
        className="mx-auto max-w-7xl px-6 py-20 lg:px-8"
      >
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Our collection
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Featured Products
            </h2>

            <p className="mt-3 max-w-xl text-slate-600">
              Browse our carefully selected products and
              find something made for you.
            </p>
          </div>

          {/* SEARCH */}
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* FILTERS */}
        <div className="mt-8 flex flex-wrap gap-3">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                category === item
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "border border-slate-300 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

    {/* PRODUCT GRID */}
<div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
  {loading ? (
    <div className="col-span-full rounded-2xl border border-slate-200 bg-white py-16 text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

      <p className="mt-4 font-semibold text-slate-700">
        Loading products...
      </p>
    </div>
  ) : (
    filteredProducts.map((product) => (
      <div
        key={product.id}
        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="relative flex h-56 items-center justify-center bg-slate-100">

          <span className="text-8xl transition duration-300 group-hover:scale-110">
            {getProductIcon(product)}
          </span>

          <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
            {product.category}
          </span>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold">
            {product.name}
          </h3>

          <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
            {product.description}
          </p>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-xl font-bold text-slate-950">
              ${product.price.toFixed(2)}
            </span>

            <button
              type="button"
              onClick={() => addToCart(product.id)}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    ))
  )}
</div>

{!loading && filteredProducts.length === 0 && (
  <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
    <p className="text-lg font-semibold">
      No products found
    </p>

    <p className="mt-2 text-sm text-slate-500">
      Try another search or category.
    </p>
  </div>
)}
      </section>

      {/* CART */}
      <section
        id="cart"
        className="border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8">

          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Your selection
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Shopping Cart
            </h2>
          </div>

          {cartItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
              <div className="text-5xl">🛒</div>

              <h3 className="mt-4 text-xl font-bold">
                Your cart is empty
              </h3>

              <p className="mt-2 text-slate-500">
                Add some products to get started.
              </p>

              <a
                href="#products"
                className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Browse Products
              </a>
            </div>
          ) : (
            <div className="space-y-4">

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 p-5 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-5">

                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 text-3xl">
                      {getProductIcon(item)}
                    </div>

                    <div>
                      <h3 className="font-bold">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">

                    <div className="flex items-center rounded-xl border border-slate-300">
                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                        className="px-3 py-2 text-lg hover:bg-slate-100"
                      >
                        −
                      </button>

                      <span className="min-w-10 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          addToCart(item.id)
                        }
                        className="px-3 py-2 text-lg hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>

                    <span className="min-w-20 text-right text-lg font-bold">
                      $
                      {(
                        item.price *
                        item.quantity
                      ).toFixed(2)}
                    </span>

                  </div>
                </div>
              ))}

              <div className="mt-8 rounded-2xl bg-slate-50 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    Total
                  </span>

                  <span className="text-3xl font-bold text-blue-600">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={checkout}
                  className="mt-5 w-full rounded-xl bg-blue-600 py-4 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
                >
                  Proceed to Secure Checkout
                </button>

                <p className="mt-3 text-center text-xs text-slate-500">
                  🔒 Secure payment powered by Stripe
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="bg-slate-950 px-6 py-20 text-white"
      >
        <div className="mx-auto max-w-4xl text-center">

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            About ShopEase
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            A simple shopping experience built for everyone.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
            ShopEase brings quality products, simple cart
            management, and secure online payments together
            in one modern e-commerce platform.
          </p>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 px-6 pb-8 text-center text-slate-500">

        <div className="mx-auto max-w-7xl border-t border-slate-800 pt-8">

          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                S
              </div>

              <span className="font-semibold text-white">
                ShopEase
              </span>
            </div>

            <p className="text-sm">
              © 2026 ShopEase · Designed & Developed by Laiba Shehzadi
            </p>

          </div>

        </div>

      </footer>

    </main>
  );
}