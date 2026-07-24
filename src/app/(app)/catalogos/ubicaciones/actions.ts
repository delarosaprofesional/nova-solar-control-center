"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createUbicacion(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("ubicaciones").insert({
    nombre_ubicacion: String(formData.get("nombre_ubicacion")),
    tipo_ubicacion: String(formData.get("tipo_ubicacion")),
    direccion: String(formData.get("direccion") || "") || null,
    responsable_id: String(formData.get("responsable_id") || "") || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/catalogos/ubicaciones");
  return { error: null };
}

export async function toggleActivaUbicacion(id: string, activa: boolean) {
  const supabase = await createClient();
  await supabase.from("ubicaciones").update({ activa }).eq("id", id);
  revalidatePath("/catalogos/ubicaciones");
}
