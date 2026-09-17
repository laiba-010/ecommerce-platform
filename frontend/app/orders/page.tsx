"use client";

import { useEffect, useState } from "react";

type Order = {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "https://ecommerce-platform-cw8q0k2sl-task-flow-8fca.vercel.app/api/orders"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Orders Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
              S
            </div>

            <div>
              <h1 className="font-bold">ShopEase</h1>
              <p className="text-xs text-slate-500">
                Smart shopping, simplified.
              </p>
            </div>
          </a>

          <a
            href="/"
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Continue Shopping
          </a>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Order History
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            Your Orders
          </h2>

          <p className="mt-3 text-slate-600">
            View your recent orders and payment status.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 font-semibold text-slate-700">
              Loading orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <div className="text-5xl">📦</div>

            <h3 className="mt-4 text-xl font-bold">
              No orders yet
            </h3>

            <p className="mt-2 text-slate-500">
              Your completed orders will appear here.
            </p>

            <a
              href="/"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm text-slate-500">
                      Order #{order.id}
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      ${order.totalAmount.toFixed(2)}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}