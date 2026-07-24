"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function currentUsuarioId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("usuarios").select("id").eq("auth_user_id", user.id).maybeSingle();
  return data?.id ?? null;
}

export async function createOrden(formData: FormData) {
  const supabase = await createClient();
  const usuarioId = await currentUsuarioId(supabase);

  const { data, error } = await supabase
    .from("ordenes_trabajo")
    .insert({
      cliente_id: String(formData.get("cliente_id")),
      telefono: String(formData.get("telefono") || "") || null,
      direccion_trabajo: String(formData.get("direccion_trabajo")),
      tipo_instalacion: String(formData.get("tipo_instalacion")),
      kit_contratado_id: String(formData.get("kit_contratado_id") || "") || null,
      brigada_asignada_id: String(formData.get("brigada_asignada_id") || "") || null,
      creado_por_id: usuarioId,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/ordenes");
  return { error: null, id: data.id };
}

export async function addMaterialLine(formData: FormData) {
  const supabase = await createClient();
  const usuarioId = await currentUsuarioId(supabase);
  const ordenId = String(formData.get("orden_id"));

  const { error } = await supabase.from("materiales_orden").insert({
    orden_id: ordenId,
    producto_id: String(formData.get("producto_id")),
    cantidad_asignada: Number(formData.get("cantidad_asignada")),
    ubicacion_salida_id: String(formData.get("ubicacion_salida_id")),
    responsable_id: usuarioId,
  });

  if (error) return { error: error.message };

  revalidatePath(`/ordenes/${ordenId}`);
  return { error: null };
}

export async function avanzarEstado(ordenId: string, nuevoEstado: string, extra?: Record<string, string>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("ordenes_trabajo")
    .update({ estado: nuevoEstado, ...extra })
    .eq("id", ordenId);

  if (error) return { error: error.message };

  revalidatePath(`/ordenes/${ordenId}`);
  revalidatePath("/ordenes");
  return { error: null };
}

export async function guardarCierre(formData: FormData) {
  const supabase = await createClient();
  const ordenId = String(formData.get("orden_id"));
  const lineaIds = formData.getAll("linea_id") as string[];

  for (const lineaId of lineaIds) {
    const cantidadUtilizada = formData.get(`utilizada_${lineaId}`);
    const cantidadDevuelta = formData.get(`devuelta_${lineaId}`);
    const precioUnitarioCliente = formData.get(`precio_${lineaId}`);

    const { error } = await supabase
      .from("materiales_orden")
      .update({
        cantidad_utilizada: Number(cantidadUtilizada),
        cantidad_devuelta: Number(cantidadDevuelta || 0),
        precio_unitario_cliente: Number(precioUnitarioCliente),
      })
      .eq("id", lineaId);

    if (error) return { error: `Línea ${lineaId}: ${error.message}` };
  }

  const costoManoObra = Number(formData.get("costo_mano_obra") || 0);
  const otrosCostos = Number(formData.get("otros_costos") || 0);

  const { error: errorOrden } = await supabase
    .from("ordenes_trabajo")
    .update({
      estado: "Terminada",
      costo_mano_obra: costoManoObra,
      otros_costos: otrosCostos,
    })
    .eq("id", ordenId);

  if (errorOrden) return { error: errorOrden.message };

  revalidatePath(`/ordenes/${ordenId}`);
  revalidatePath("/ordenes");
  return { error: null };
}

export async function cerrarCobro(formData: FormData) {
  const supabase = await createClient();
  const ordenId = String(formData.get("orden_id"));

  const { error } = await supabase
    .from("ordenes_trabajo")
    .update({ estado: "Cerrada_Pagada", estado_cobro: String(formData.get("estado_cobro")) })
    .eq("id", ordenId);

  if (error) return { error: error.message };

  revalidatePath(`/ordenes/${ordenId}`);
  revalidatePath("/ordenes");
  return { error: null };
}

export async function cancelarOrden(ordenId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("ordenes_trabajo").update({ estado: "Cancelada" }).eq("id", ordenId);

  if (error) return { error: error.message };

  revalidatePath(`/ordenes/${ordenId}`);
  revalidatePath("/ordenes");
  return { error: null };
}
