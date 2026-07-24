import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCurrentUserContext } from "@/lib/nova/current-user";
import { createClient } from "@/lib/supabase/server";
import { GastoForm } from "./gasto-form";

function money(n: number | null) {
  return (n ?? 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function GastosPage() {
  const ctx = await getCurrentUserContext();
  const supabase = await createClient();
  const puedeRegistrar = ctx?.rol === "Administrador" || ctx?.rol === "Contabilidad";

  const [{ data: gastos, error }, { data: proveedores }, { data: ordenes }] = await Promise.all([
    supabase
      .from("gastos_con_alertas")
      .select("id, fecha, categoria, subcategoria, descripcion, monto, metodo_pago, alerta_recibo_pendiente, proveedores(nombre_proveedor)")
      .order("fecha", { ascending: false }),
    supabase.from("proveedores").select("id, nombre_proveedor").eq("activo", true).order("nombre_proveedor"),
    supabase.from("ordenes_trabajo").select("id, direccion_trabajo").order("fecha_creacion", { ascending: false }),
  ]);

  return (
    <div className="space-y-6">
      {puedeRegistrar ? (
        <Card>
          <CardHeader>
            <CardTitle>Nuevo gasto</CardTitle>
          </CardHeader>
          <CardContent>
            <GastoForm
              proveedores={(proveedores ?? []).map((p) => ({ id: p.id, label: p.nombre_proveedor }))}
              ordenes={(ordenes ?? []).map((o) => ({ id: o.id, label: `${o.id} — ${o.direccion_trabajo}` }))}
            />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Gastos registrados</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">Error al cargar gastos: {error.message}</p>
          ) : !gastos || gastos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Todavía no hay gastos registrados.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead>Alerta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gastos.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell>{g.fecha}</TableCell>
                    <TableCell>{g.categoria}</TableCell>
                    <TableCell className="max-w-56 truncate">{g.descripcion}</TableCell>
                    <TableCell>{(g.proveedores as { nombre_proveedor: string } | null)?.nombre_proveedor ?? "—"}</TableCell>
                    <TableCell className="text-right">{money(g.monto)}</TableCell>
                    <TableCell>{g.metodo_pago}</TableCell>
                    <TableCell>
                      {g.alerta_recibo_pendiente ? (
                        <Badge variant="destructive">Falta recibo</Badge>
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
