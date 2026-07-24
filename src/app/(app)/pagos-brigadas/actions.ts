"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createPagoBrigada(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { data: usuario } = await supabase.from("usuarios").select("id").eq("auth_user_id", user.id).maybeSingle();

  const estadoPago = String(formData.get("estado_pago"));

  const { error } = await supabase.from("pagos_brigadas").insert({
    fecha: String(formData.get("fecha")),
    orden_id: String(formData.get("orden_id")),
    brigada_id: String(formData.get("brigada_id") || "") || null,
    trabajador_id: String(formData.get("trabajador_id") || "") || null,
    monto: Number(formData.get("monto")),
    metodo_pago: String(formData.get("metodo_pago")),
    estado_pago: estadoPago,
    fecha_pago: estadoPago === "Pagado" ? String(formData.get("fecha_pago") || "") || null : null,
    notas: String(formData.get("notas") || "") || null,
    registrado_por_id: usuario?.id ?? null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/pagos-brigadas");
  return { error: null };
}
