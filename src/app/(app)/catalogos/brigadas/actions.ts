"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createBrigada(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("brigadas").insert({
    nombre_brigada: String(formData.get("nombre_brigada")),
    supervisor_id: String(formData.get("supervisor_id") || "") || null,
    telefono: String(formData.get("telefono") || "") || null,
    estado: "Activa",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/catalogos/brigadas");
  return { error: null };
}

export async function toggleEstadoBrigada(id: string, activa: boolean) {
  const supabase = await createClient();
  await supabase.from("brigadas").update({ estado: activa ? "Activa" : "Inactiva" }).eq("id", id);
  revalidatePath("/catalogos/brigadas");
}
