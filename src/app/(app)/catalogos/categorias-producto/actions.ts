"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createCategoriaProducto(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("categorias_producto").insert({
    nombre: String(formData.get("nombre")),
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/catalogos/categorias-producto");
  revalidatePath("/catalogos/productos");
  return { error: null };
}

export async function toggleActivoCategoriaProducto(id: string, activo: boolean) {
  const supabase = await createClient();
  await supabase.from("categorias_producto").update({ activo }).eq("id", id);
  revalidatePath("/catalogos/categorias-producto");
  revalidatePath("/catalogos/productos");
}
