import { createClient } from "@/lib/supabase/server";

export type CurrentUserContext = {
  authUserId: string;
  email: string;
  nombre: string | null;
  rol: string | null;
  ubicacionAsignadaId: string | null;
};

export async function getCurrentUserContext(): Promise<CurrentUserContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [{ data: usuario }, { data: rol }, { data: ubicacion }] = await Promise.all([
    supabase.from("usuarios").select("nombre").eq("auth_user_id", user.id).maybeSingle(),
    supabase.rpc("fn_rol_actual"),
    supabase.rpc("fn_ubicacion_actual"),
  ]);

  return {
    authUserId: user.id,
    email: user.email ?? "",
    nombre: usuario?.nombre ?? null,
    rol: rol ?? null,
    ubicacionAsignadaId: ubicacion ?? null,
  };
}
