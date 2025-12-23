"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createProductWithImage(
  formData: FormData,
  businessSlug: string
) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const base_price = parseFloat(formData.get("base_price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const category_id = formData.get("category_id") as string;
  const business_id = formData.get("business_id") as string;
  const imageFile = formData.get("image") as File;

  let imageUrl = null;

  // 1. Upload Image to Storage
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${business_id}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, imageFile);

    if (uploadError)
      throw new Error("Image upload failed: " + uploadError.message);

    // 2. Get Public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(filePath);

    imageUrl = publicUrl;
  }

  // 3. Insert Product into Database
  const { error } = await supabase.from("products").insert({
    name,
    base_price,
    stock,
    category_id,
    business_id,
    image_url: imageUrl, // Ensure this column exists in your products table
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/${businessSlug}/tables/products`);
}

export async function updateProductWithImage(
  id: string,
  formData: FormData,
  businessSlug: string
) {
  const supabase = await createClient();
  const imageFile = formData.get("image") as File;

  let imageUrl = formData.get("image_url") as string;

  // If a new file is provided, upload it
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${id}-${Math.random()}.${fileExt}`;
    const filePath = `${businessSlug}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, imageFile);

    if (uploadError) throw new Error(uploadError.message);

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(filePath);

    imageUrl = publicUrl;
  }

  const { error } = await supabase
    .from("products")
    .update({
      name: formData.get("name") as string,
      base_price: parseFloat(formData.get("base_price") as string),
      stock: parseInt(formData.get("stock") as string),
      category_id: formData.get("category_id") as string,
      image_url: imageUrl,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(`/${businessSlug}/tables/products`);
}

export async function deleteProduct(id: string, businessSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/${businessSlug}/tables/products`);
}
