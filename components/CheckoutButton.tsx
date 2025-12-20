"use client";

import { createClient } from "@/lib/supabase/client";
import { useOrderStore } from "@/stores/useOrderStore";

export default function CheckoutButton({
  businessId,
  storeId,
  userId,
}: {
  businessId: string;
  storeId: string;
  userId: string;
}) {
  const { items, getTotal, clearOrder } = useOrderStore();
  const supabase = createClient();

  const handleCheckout = async () => {
    if (items.length === 0) return;

    try {
      // 1. Insert into 'orders' table
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          business_id: businessId,
          store_id: storeId,
          created_by: userId,
          total_amount: getTotal(),
          tax_amount: 0, // Calculate tax here if needed
          payment_method: "cash", // Or get from a state
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Prepare 'order_items' data using the new order.id
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.base_price,
      }));

      // 3. Batch insert into 'order_items'
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 4. Success! Clear the store and alert user
      alert("Order placed successfully!");
      clearOrder();
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-secondary cursor-pointer transition-colors"
    >
      Place Order (IDR {getTotal().toLocaleString("id-ID")})
    </button>
  );
}
