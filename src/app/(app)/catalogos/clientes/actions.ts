"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createCliente(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("clientes").insert({
    nombre_cliente: String(formData.get("nombre_cliente")),
    telefono: String(formData.get("telefono") || "") || null,
    email: String(formData.get("email") || "") || null,
    direccion: String(formData.get("direccion") || "") || null,
    tipo_cliente: String(formData.get("tipo_cliente") || "") || null,
    fuente: String(formData.get("fuente") || "") || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/catalogos/clientes");
  return { error: null };
}

export async function toggleActivoCliente(id: string, activo: boolean) {
  const supabase = await createClient();
  await supabase.from("clientes").update({ activo }).eq("id", id);
  revalidatePath("/catalogos/clientes");
}
