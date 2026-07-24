"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createCompra(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { data: usuario } = await supabase.from("usuarios").select("id").eq("auth_user_id", user.id).maybeSingle();

  const { error } = await supabase.from("compras").insert({
    fecha: String(formData.get("fecha")),
    proveedor_id: String(formData.get("proveedor_id") || "") || null,
    numero_factura: String(formData.get("numero_factura") || "") || null,
    producto_id: String(formData.get("producto_id")),
    cantidad: Number(formData.get("cantidad")),
    costo_unitario: Number(formData.get("costo_unitario")),
    ubicacion_entrada_id: String(formData.get("ubicacion_entrada_id") || "") || null,
    metodo_pago: String(formData.get("metodo_pago")),
    estado_pago: String(formData.get("estado_pago")),
    estado_validacion: "OK",
    registrado_por_id: usuario?.id ?? null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/compras");
  revalidatePath("/");
  return { error: null };
}
