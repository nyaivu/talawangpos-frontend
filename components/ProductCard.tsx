// components/ProductCard.tsx
"use client";

import { Product } from "@/interfaces/product";
import { useOrderStore } from "@/stores/useOrderStore";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Logic: Item is out of stock ONLY if tracking is enabled and stock is 0 or less
  const isOutOfStock = product.track_inventory && product.stock <= 0;
  const addItem = useOrderStore((state) => state.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    // You could add a toast here like "Added to cart!"
  };

  return (
    <button onClick={handleAdd}>
      <div
        className={`relative flex flex-col items-start border rounded-xl overflow-hidden bg-white shadow-sm transition-all ${
          isOutOfStock ? "opacity-60 grayscale" : "hover:shadow-md"
        }`}
      >
        {/* Stock Badge */}
        {product.track_inventory && (
          <div
            className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold uppercase ${
              isOutOfStock
                ? "bg-red-500 text-white"
                : "bg-accent text-foreground"
            }`}
          >
            {isOutOfStock ? "Sold Out" : `${product.stock} Left`}
          </div>
        )}
        <div className="aspect-square bg-gray-100 overflow-hidden">
          <Image
            src={product.image_url}
            width={400}
            height={400}
            alt={product.name}
            className="h-full object-cover object-center"
          />
        </div>
        <div className="p-2 flex flex-col items-start">
          <p className="text-xs text-gray-500">{product.category?.name}</p>
          <h3 className="font-semibold text-sm truncate">{product.name}</h3>
          <p className="text-primary font-bold mt-1">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(product.base_price)}
          </p>
        </div>
      </div>
    </button>
  );
}
