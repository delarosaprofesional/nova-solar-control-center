"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createProducto(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("productos").insert({
    nombre_producto: String(formData.get("nombre_producto")),
    tipo_producto: String(formData.get("tipo_producto")),
    categoria: String(formData.get("categoria")),
    unidad_medida: String(formData.get("unidad_medida")),
    marca: String(formData.get("marca") || "") || null,
    modelo: String(formData.get("modelo") || "") || null,
    sku: String(formData.get("sku") || "") || null,
    precio_sugerido: formData.get("precio_sugerido") ? Number(formData.get("precio_sugerido")) : null,
    stock_minimo: formData.get("stock_minimo") ? Number(formData.get("stock_minimo")) : 0,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/catalogos/productos");
  return { error: null };
}

export async function toggleActivoProducto(id: string, activo: boolean) {
  const supabase = await createClient();
  await supabase.from("productos").update({ activo }).eq("id", id);
  revalidatePath("/catalogos/productos");
}
