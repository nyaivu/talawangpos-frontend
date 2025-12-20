"use client";

import { useOrderStore } from "@/stores/useOrderStore";
import { useHydratedStore } from "@/hooks/useHydratedStore"; // Import your new hook
import CheckoutButton from "./CheckoutButton";
import { useState } from "react";
import CheckoutModal from "./CheckoutModal";

interface OrderSidebarProps {
  businessId: string;
  storeId: string;
  userId: string;
}

export default function OrderSidebar({
  businessId,
  storeId,
  userId,
}: OrderSidebarProps) {
  // Use the hydrated hook to safely get items and total
  const items = useHydratedStore(useOrderStore, (s) => s.items);
  const getTotal = useOrderStore((s) => s.getTotal); // Functions are safe to call directly
  const updateQuantity = useOrderStore((s) => s.updateQuantity); // Functions are safe to call directly
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If items is undefined, we are still hydrating
  if (!items) {
    return <div className="p-4 text-gray-400">Loading order...</div>;
  }

  return (
    <div className="border-l p-4 flex flex-col h-full text-background">
      <div className="">
        <h2 className="text-xl font-bold mb-4">Current Order</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center text-sm "
          >
            <div className="flex flex-col gap-1">
              <p className="font-medium">{item.name}</p>
              <div className="flex flex-row items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="cursor-pointer w-6 bg-primary rounded-full aspect-square hover:bg-secondary"
                >
                  -
                </button>
                <p className="text-gray-100">x{item.quantity}</p>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="cursor-pointer w-6 bg-primary rounded-full aspect-square hover:bg-secondary"
                >
                  +
                </button>
              </div>
            </div>
            <p className="font-bold">
              IDR {(item.base_price * item.quantity).toLocaleString("id-ID")}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 border-t pt-4 mt-4">
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>IDR {getTotal().toLocaleString("id-ID")}</span>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full py-4 bg-black text-white rounded-2xl font-bold"
        >
          Checkout (Rp {getTotal().toLocaleString()})
        </button>
      </div>

      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        businessId={businessId}
        storeId={storeId}
        userId={userId}
      />
    </div>
  );
}
