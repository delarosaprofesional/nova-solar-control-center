"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createVenta(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { data: usuario } = await supabase.from("usuarios").select("id").eq("auth_user_id", user.id).maybeSingle();

  const { error } = await supabase.from("ventas_tienda").insert({
    fecha: String(formData.get("fecha")),
    punto_venta_id: String(formData.get("punto_venta_id")),
    cliente_id: String(formData.get("cliente_id")),
    producto_id: String(formData.get("producto_id")),
    cantidad: Number(formData.get("cantidad")),
    precio_unitario: Number(formData.get("precio_unitario")),
    metodo_pago: String(formData.get("metodo_pago")),
    estado_validacion: "OK",
    vendedor_id: usuario?.id ?? null,
    registrado_por_id: usuario?.id ?? null,
  });

  if (error) {
    // Los mensajes de bloqueo de stock y de Kit_Personalizado vienen del trigger de la base de datos
    return { error: error.message };
  }

  revalidatePath("/ventas");
  revalidatePath("/");
  return { error: null };
}
