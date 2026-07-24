"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createTransferencia(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { data: usuario } = await supabase.from("usuarios").select("id").eq("auth_user_id", user.id).maybeSingle();

  const { error } = await supabase.from("transferencias").insert({
    producto_id: String(formData.get("producto_id")),
    cantidad: Number(formData.get("cantidad")),
    ubicacion_origen_id: String(formData.get("ubicacion_origen_id")),
    ubicacion_destino_id: String(formData.get("ubicacion_destino_id")),
    notas: String(formData.get("notas") || "") || null,
    solicitado_por_id: usuario?.id ?? null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/transferencias");
  return { error: null };
}

export async function confirmarTransferencia(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { data: usuario } = await supabase.from("usuarios").select("id").eq("auth_user_id", user.id).maybeSingle();

  const { error } = await supabase
    .from("transferencias")
    .update({ estado: "Confirmada", confirmado_por_id: usuario?.id ?? null })
    .eq("id", id);

  revalidatePath("/transferencias");
  return { error: error?.message ?? null };
}

export async function rechazarTransferencia(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { data: usuario } = await supabase.from("usuarios").select("id").eq("auth_user_id", user.id).maybeSingle();

  const { error } = await supabase
    .from("transferencias")
    .update({ estado: "Rechazada", confirmado_por_id: usuario?.id ?? null })
    .eq("id", id);

  revalidatePath("/transferencias");
  return { error: error?.message ?? null };
}
