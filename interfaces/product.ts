export interface Product {
  id: string;
  name: string;
  base_price: number;
  image_url: string;
  stock: number;
  track_inventory: boolean;
  category: {
    name: string;
  } | null;
}
