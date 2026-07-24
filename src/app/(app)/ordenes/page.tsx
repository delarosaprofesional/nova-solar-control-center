import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCurrentUserContext } from "@/lib/nova/current-user";
import { createClient } from "@/lib/supabase/server";
import { OrdenForm } from "./orden-form";

function money(n: number | null) {
  return (n ?? 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function EstadoBadge({ estado }: { estado: string }) {
  const variant =
    estado === "Cerrada_Pagada"
      ? "secondary"
      : estado === "Cancelada"
        ? "destructive"
        : "outline";
  return <Badge variant={variant}>{estado.replaceAll("_", " ")}</Badge>;
}

export default async function OrdenesPage() {
  const ctx = await getCurrentUserContext();
  const supabase = await createClient();
  const puedeCrear = ctx?.rol === "Administrador" || ctx?.rol === "Supervisor";

  const [{ data: ordenes, error }, { data: clientes }, { data: brigadas }, { data: kits }] = await Promise.all([
    supabase
      .from("ordenes_trabajo")
      .select("id, fecha_creacion, direccion_trabajo, tipo_instalacion, estado, precio_cobrado, utilidad_real, clientes(nombre_cliente), brigadas(nombre_brigada)")
      .order("fecha_creacion", { ascending: false }),
    supabase.from("clientes").select("id, nombre_cliente").eq("activo", true).order("nombre_cliente"),
    supabase.from("brigadas").select("id, nombre_brigada").order("nombre_brigada"),
    supabase.from("productos").select("id, nombre_producto").eq("activo", true).in("tipo_producto", ["Kit_Fijo", "Kit_Personalizado"]).order("nombre_producto"),
  ]);

  return (
    <div className="space-y-6">
      {puedeCrear ? (
        <Card>
          <CardHeader>
            <CardTitle>Nueva orden de trabajo</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdenForm
              clientes={(clientes ?? []).map((c) => ({ id: c.id, label: c.nombre_cliente }))}
              brigadas={(brigadas ?? []).map((b) => ({ id: b.id, label: b.nombre_brigada }))}
              kits={(kits ?? []).map((k) => ({ id: k.id, label: k.nombre_producto }))}
            />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Órdenes de trabajo</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">Error al cargar órdenes: {error.message}</p>
          ) : !ordenes || ordenes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Todavía no hay órdenes de trabajo.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Brigada</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Precio Cobrado</TableHead>
                  <TableHead className="text-right">Utilidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordenes.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>
                      <Link href={`/ordenes/${o.id}`} className="text-primary underline-offset-2 hover:underline">
                        {o.fecha_creacion}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">{(o.clientes as { nombre_cliente: string } | null)?.nombre_cliente}</TableCell>
                    <TableCell className="max-w-56 truncate">{o.direccion_trabajo}</TableCell>
                    <TableCell>{(o.brigadas as { nombre_brigada: string } | null)?.nombre_brigada ?? "—"}</TableCell>
                    <TableCell>
                      <EstadoBadge estado={o.estado} />
                    </TableCell>
                    <TableCell className="text-right">{money(o.precio_cobrado)}</TableCell>
                    <TableCell className="text-right">{money(o.utilidad_real)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
