"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createGasto(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { data: usuario } = await supabase.from("usuarios").select("id").eq("auth_user_id", user.id).maybeSingle();

  const { error } = await supabase.from("gastos").insert({
    fecha: String(formData.get("fecha")),
    categoria: String(formData.get("categoria")),
    subcategoria: String(formData.get("subcategoria") || "") || null,
    descripcion: String(formData.get("descripcion")),
    monto: Number(formData.get("monto")),
    metodo_pago: String(formData.get("metodo_pago")),
    proveedor_id: String(formData.get("proveedor_id") || "") || null,
    orden_relacionada_id: String(formData.get("orden_relacionada_id") || "") || null,
    estado_validacion: "OK",
    registrado_por_id: usuario?.id ?? null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/gastos");
  return { error: null };
}
