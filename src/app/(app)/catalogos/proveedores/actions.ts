"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createProveedor(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("proveedores").insert({
    nombre_proveedor: String(formData.get("nombre_proveedor")),
    contacto: String(formData.get("contacto") || "") || null,
    telefono: String(formData.get("telefono") || "") || null,
    email: String(formData.get("email") || "") || null,
    direccion: String(formData.get("direccion") || "") || null,
    condiciones_pago: String(formData.get("condiciones_pago") || "") || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/catalogos/proveedores");
  return { error: null };
}

export async function toggleActivoProveedor(id: string, activo: boolean) {
  const supabase = await createClient();
  await supabase.from("proveedores").update({ activo }).eq("id", id);
  revalidatePath("/catalogos/proveedores");
}
