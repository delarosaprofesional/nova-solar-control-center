import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCurrentUserContext } from "@/lib/nova/current-user";
import { createClient } from "@/lib/supabase/server";
import { CompraForm } from "./compra-form";

function money(n: number | null) {
  return (n ?? 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function ComprasPage() {
  const ctx = await getCurrentUserContext();
  const supabase = await createClient();
  const puedeRegistrar = ctx?.rol === "Administrador" || ctx?.rol === "Almacén";

  const [{ data: compras, error }, { data: productos }, { data: proveedores }, { data: ubicaciones }] =
    await Promise.all([
      supabase
        .from("compras_con_alertas")
        .select("id, fecha, cantidad, costo_unitario, costo_total, metodo_pago, estado_pago, alerta_factura_pendiente, productos(nombre_producto), proveedores(nombre_proveedor), ubicaciones(nombre_ubicacion)")
        .order("fecha", { ascending: false }),
      supabase.from("productos").select("id, nombre_producto").eq("activo", true).order("nombre_producto"),
      supabase.from("proveedores").select("id, nombre_proveedor").eq("activo", true).order("nombre_proveedor"),
      supabase.from("ubicaciones").select("id, nombre_ubicacion").eq("activa", true).order("nombre_ubicacion"),
    ]);

  return (
    <div className="space-y-6">
      {puedeRegistrar ? (
        <Card>
          <CardHeader>
            <CardTitle>Nueva compra</CardTitle>
          </CardHeader>
          <CardContent>
            <CompraForm
              productos={(productos ?? []).map((p) => ({ id: p.id, label: p.nombre_producto }))}
              proveedores={(proveedores ?? []).map((p) => ({ id: p.id, label: p.nombre_proveedor }))}
              ubicaciones={(ubicaciones ?? []).map((u) => ({ id: u.id, label: u.nombre_ubicacion }))}
            />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Compras registradas</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">Error al cargar compras: {error.message}</p>
          ) : !compras || compras.length === 0 ? (
            <p className="text-sm text-muted-foreground">Todavía no hay compras registradas.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Costo Unit.</TableHead>
                  <TableHead className="text-right">Costo Total</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead>Alerta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {compras.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.fecha}</TableCell>
                    <TableCell className="font-medium">
                      {(c.productos as { nombre_producto: string } | null)?.nombre_producto}
                    </TableCell>
                    <TableCell>{(c.proveedores as { nombre_proveedor: string } | null)?.nombre_proveedor ?? "—"}</TableCell>
                    <TableCell>{(c.ubicaciones as { nombre_ubicacion: string } | null)?.nombre_ubicacion ?? "—"}</TableCell>
                    <TableCell className="text-right">{c.cantidad}</TableCell>
                    <TableCell className="text-right">{money(c.costo_unitario)}</TableCell>
                    <TableCell className="text-right">{money(c.costo_total)}</TableCell>
                    <TableCell>
                      {c.metodo_pago} · {c.estado_pago}
                    </TableCell>
                    <TableCell>
                      {c.alerta_factura_pendiente ? (
                        <Badge variant="destructive">Falta factura</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
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
