// store/useOrderStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/interfaces/types";

interface OrderItem extends Product {
  quantity: number;
}

interface OrderState {
  items: OrderItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearOrder: () => void;
  getTotal: () => number;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearOrder: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.base_price * item.quantity,
          0
        );
      },
    }),
    {
      name: "current-order-storage", // key in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
