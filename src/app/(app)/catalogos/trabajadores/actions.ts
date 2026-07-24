"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createTrabajador(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("trabajadores").insert({
    nombre: String(formData.get("nombre")),
    telefono: String(formData.get("telefono") || "") || null,
    rol_trabajo: String(formData.get("rol_trabajo") || "") || null,
    brigada_id: String(formData.get("brigada_id") || "") || null,
    tipo_pago: String(formData.get("tipo_pago") || "") || null,
    estado: "Activo",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/catalogos/trabajadores");
  return { error: null };
}

export async function toggleEstadoTrabajador(id: string, activo: boolean) {
  const supabase = await createClient();
  await supabase.from("trabajadores").update({ estado: activo ? "Activo" : "Inactivo" }).eq("id", id);
  revalidatePath("/catalogos/trabajadores");
}
