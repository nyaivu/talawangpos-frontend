// app/[business_slug]/orders/page.tsx
import { createClient } from "@/lib/supabase/server";
import { QueryData } from "@supabase/supabase-js";
import { format } from "date-fns";

export default async function OrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("staff_profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  console.log("Logged in as:", user?.id);
  console.log("My Business ID in profile:", profile?.business_id);

  // 1. Define the query as a constant to extract its type
  const ordersQuery = supabase.from("orders").select(`
    id,
    created_at,
    total_amount,
    payment_method,  
    order_items (
      id,
      quantity,
      unit_price,
      products!inner (
        name
      )
    )
  `);

  // 2. Extract the type from the query
  type OrdersWithItems = QueryData<typeof ordersQuery>;

  const { data, error } = await ordersQuery;

  if (error)
    return <div className="p-6 text-red-500">Error: {error.message}</div>;

  // 3. Apply the type to the result
  const orders: OrdersWithItems = data;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Transaction History</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white border rounded-xl p-6 shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500">
                {format(new Date(order.created_at), "PPP p")}
              </p>
              <p className="text-xs font-mono text-gray-400">{order.id}</p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold uppercase">
                {order.payment_method}
              </span>
              <p className="text-xl font-bold text-green-600 mt-1">
                Rp {order.total_amount.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <div className="space-y-3 border-t pt-4">
            {order.order_items.map((item) => {
              // 1. Safely extract the product object from the array
              // We use [0] because an order_item technically only links to one product
              const product = Array.isArray(item.products)
                ? item.products[0]
                : item.products;

              return (
                <div
                  key={item.id}
                  className="flex justify-between text-sm py-1"
                >
                  <span className="text-gray-700">
                    {/* 2. Access .name from the extracted object */}
                    {product?.name || "Unknown Product"}
                    <span className="text-gray-400 ml-2">x{item.quantity}</span>
                  </span>
                  <span className="font-medium">
                    Rp{" "}
                    {(
                      (item.unit_price ?? 0) * (item.quantity ?? 0)
                    ).toLocaleString("id-ID")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
