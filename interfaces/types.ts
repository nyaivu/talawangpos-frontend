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

export interface CategoryRow {
  id: string;
  name: string;
  business_id?: string;
  created_at?: string;
  businesses: {
    slug: string;
  }[];
}
