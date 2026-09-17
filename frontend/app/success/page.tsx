"use client";

import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const confirmOrder = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");

      if (!sessionId) {
        setStatus("error");
        setMessage("Payment session was not found.");
        return;
      }

      try {
        const response = await fetch(
          "https://ecommerce-platform-cw8q0k2sl-task-flow-8fca.vercel.app/api/orders/confirm?session_id="
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Payment verification failed.");
        }

        setStatus("success");
        localStorage.removeItem("shopease-cart");
        setMessage("Your payment has been verified and your order has been created.");
      } catch (error) {
        console.error("Order Confirmation Error:", error);
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to verify your payment."
        );
      }
    };

    confirmOrder();
  }, []);

  if (status === "verifying") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <h1 className="mt-6 text-2xl font-bold text-slate-950">
            Verifying Payment...
          </h1>

          <p className="mt-3 text-slate-500">
            Please wait while we confirm your payment and order.
          </p>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-lg rounded-3xl border border-red-200 bg-white p-10 text-center shadow-xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl">
            !
          </div>

          <h1 className="mt-6 text-3xl font-bold text-slate-950">
            Payment Verification Failed
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            {message}
          </p>

          <a
            href="/"
            className="mt-8 block rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Return to Shop
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
          ✓
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-green-600">
          Payment Successful
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-950">
          Thank You for Your Order!
        </h1>

        <p className="mt-4 leading-7 text-slate-600">
          {message}
        </p>

        <div className="mt-8 rounded-2xl bg-slate-50 p-5 text-left">
          <div className="flex justify-between">
            <span className="text-slate-500">
              Payment Status
            </span>

            <span className="font-semibold text-green-600">
              Paid
            </span>
          </div>

          <div className="mt-3 flex justify-between">
            <span className="text-slate-500">
              Payment Method
            </span>

            <span className="font-semibold">
              Stripe
            </span>
          </div>
        </div>

        <a
          href="/"
          className="mt-8 block rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
        >
          Continue Shopping
        </a>
      </div>
    </main>
  );
}