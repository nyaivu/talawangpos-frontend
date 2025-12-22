// app/[business_slug]/tables/categories/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function insertCategory(
  name: string,
  businessId: string,
  businessSlug: string
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .insert({ name, business_id: businessId });

  if (error) throw new Error(error.message);
  revalidatePath(`/${businessSlug}/tables/categories`);
}

export async function updateCategory(
  id: string,
  name: string,
  businessSlug: string
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ name })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(`/${businessSlug}/tables/categories`);
}

export async function deleteCategory(id: string, businessSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(`/${businessSlug}/tables/categories`);
}
