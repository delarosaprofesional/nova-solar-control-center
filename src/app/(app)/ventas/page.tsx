import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCurrentUserContext } from "@/lib/nova/current-user";
import { createClient } from "@/lib/supabase/server";
import { VentaForm } from "./venta-form";

function money(n: number | null) {
  return (n ?? 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function VentasPage() {
  const ctx = await getCurrentUserContext();
  const supabase = await createClient();
  const puedeRegistrar = ctx?.rol === "Administrador" || ctx?.rol === "Tienda";

  const ubicacionesQuery = supabase.from("ubicaciones").select("id, nombre_ubicacion").eq("activa", true);
  if (ctx?.rol === "Tienda" && ctx.ubicacionAsignadaId) {
    ubicacionesQuery.eq("id", ctx.ubicacionAsignadaId);
  }

  const [{ data: ventas, error }, { data: productos }, { data: clientes }, { data: ubicaciones }] = await Promise.all([
    supabase
      .from("ventas_tienda")
      .select("id, fecha, cantidad, precio_unitario, total_venta, costo_unitario, utilidad_bruta, margen_bruto, metodo_pago, productos(nombre_producto), clientes(nombre_cliente), ubicaciones(nombre_ubicacion)")
      .order("fecha", { ascending: false }),
    supabase.from("productos").select("id, nombre_producto").eq("activo", true).neq("tipo_producto", "Kit_Personalizado").order("nombre_producto"),
    supabase.from("clientes").select("id, nombre_cliente").eq("activo", true).order("nombre_cliente"),
    ubicacionesQuery.order("nombre_ubicacion"),
  ]);

  return (
    <div className="space-y-6">
      {puedeRegistrar ? (
        <Card>
          <CardHeader>
            <CardTitle>Nueva venta</CardTitle>
          </CardHeader>
          <CardContent>
            <VentaForm
              productos={(productos ?? []).map((p) => ({ id: p.id, label: p.nombre_producto }))}
              clientes={(clientes ?? []).map((c) => ({ id: c.id, label: c.nombre_cliente }))}
              ubicaciones={(ubicaciones ?? []).map((u) => ({ id: u.id, label: u.nombre_ubicacion }))}
            />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Ventas registradas</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">Error al cargar ventas: {error.message}</p>
          ) : !ventas || ventas.length === 0 ? (
            <p className="text-sm text-muted-foreground">Todavía no hay ventas registradas.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Precio Unit.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Costo Unit.</TableHead>
                  <TableHead className="text-right">Utilidad</TableHead>
                  <TableHead className="text-right">Margen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ventas.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>{v.fecha}</TableCell>
                    <TableCell className="font-medium">
                      {(v.productos as { nombre_producto: string } | null)?.nombre_producto}
                    </TableCell>
                    <TableCell>{(v.clientes as { nombre_cliente: string } | null)?.nombre_cliente}</TableCell>
                    <TableCell>{(v.ubicaciones as { nombre_ubicacion: string } | null)?.nombre_ubicacion ?? "—"}</TableCell>
                    <TableCell className="text-right">{v.cantidad}</TableCell>
                    <TableCell className="text-right">{money(v.precio_unitario)}</TableCell>
                    <TableCell className="text-right">{money(v.total_venta)}</TableCell>
                    <TableCell className="text-right">{money(v.costo_unitario)}</TableCell>
                    <TableCell className="text-right">{money(v.utilidad_bruta)}</TableCell>
                    <TableCell className="text-right">{((v.margen_bruto ?? 0) * 100).toFixed(0)}%</TableCell>
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
