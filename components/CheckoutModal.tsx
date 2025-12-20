"use client";

import { useState } from "react";
import { useOrderStore } from "@/stores/useOrderStore";
import { createClient } from "@/lib/supabase/client";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  storeId: string;
  userId: string;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  businessId,
  storeId,
  userId,
}: CheckoutModalProps) {
  const { items, getTotal, clearOrder } = useOrderStore();
  const [paymentMethod, setPaymentMethod] = useState("Cash"); // Default to valid constraint
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  if (!isOpen) return null;

  const handleFinalCheckout = async () => {
    setIsSubmitting(true);
    try {
      // 1. Insert Parent Order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          business_id: businessId,
          store_id: storeId,
          created_by: userId,
          total_amount: getTotal(),
          tax_amount: 0,
          payment_method: paymentMethod.toLowerCase(), // Validated via UI
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert Order Items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.base_price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);
      if (itemsError) throw itemsError;

      clearOrder();
      onClose();
      alert("Order completed!");
    } catch (err) {
      console.error(err);
      alert("Checkout failed. Check payment method constraints.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background text-foreground rounded-2xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Confirm Order</h2>

          {/* Order Summary */}
          <div className="space-y-2 mb-6 max-h-40 overflow-y-auto border-b pb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>
                  Rp {(item.base_price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total</span>
            <span>Rp {getTotal().toLocaleString()}</span>
          </div>

          {/* Payment Method Selection - Fixes Constraint 23514 */}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {["Cash", "QRIS", "Card", "Transfer"].map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`py-2 px-4 rounded-xl border-2 transition-all ${
                  paymentMethod === method
                    ? "border-black bg-black text-white"
                    : "border-gray-100 hover:border-gray-300"
                }`}
              >
                {method}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 font-semibold text-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleFinalCheckout}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-accent text-white rounded-xl font-bold disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
