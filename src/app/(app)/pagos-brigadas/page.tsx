import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCurrentUserContext } from "@/lib/nova/current-user";
import { createClient } from "@/lib/supabase/server";
import { PagoBrigadaForm } from "./pago-form";

function money(n: number | null) {
  return (n ?? 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function PagosBrigadasPage() {
  const ctx = await getCurrentUserContext();
  const supabase = await createClient();
  const puedeRegistrar = ctx?.rol === "Administrador" || ctx?.rol === "Contabilidad";

  const [{ data: pagos, error }, { data: ordenes }, { data: brigadas }, { data: trabajadores }] = await Promise.all([
    supabase
      .from("pagos_brigadas")
      .select("id, fecha, monto, metodo_pago, estado_pago, fecha_pago, ordenes_trabajo(id, direccion_trabajo), brigadas(nombre_brigada), trabajadores(nombre)")
      .order("fecha", { ascending: false }),
    supabase.from("ordenes_trabajo").select("id, direccion_trabajo").order("fecha_creacion", { ascending: false }),
    supabase.from("brigadas").select("id, nombre_brigada").order("nombre_brigada"),
    supabase.from("trabajadores").select("id, nombre").order("nombre"),
  ]);

  return (
    <div className="space-y-6">
      {puedeRegistrar ? (
        <Card>
          <CardHeader>
            <CardTitle>Nuevo pago a brigada</CardTitle>
          </CardHeader>
          <CardContent>
            <PagoBrigadaForm
              ordenes={(ordenes ?? []).map((o) => ({ id: o.id, label: `${o.id} — ${o.direccion_trabajo}` }))}
              brigadas={(brigadas ?? []).map((b) => ({ id: b.id, label: b.nombre_brigada }))}
              trabajadores={(trabajadores ?? []).map((t) => ({ id: t.id, label: t.nombre }))}
            />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Pagos a brigadas</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">Error al cargar pagos: {error.message}</p>
          ) : !pagos || pagos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Todavía no hay pagos registrados.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Orden</TableHead>
                  <TableHead>Brigada</TableHead>
                  <TableHead>Trabajador</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagos.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.fecha}</TableCell>
                    <TableCell className="max-w-56 truncate">
                      {(p.ordenes_trabajo as { id: string; direccion_trabajo: string } | null)?.direccion_trabajo}
                    </TableCell>
                    <TableCell>{(p.brigadas as { nombre_brigada: string } | null)?.nombre_brigada ?? "—"}</TableCell>
                    <TableCell>{(p.trabajadores as { nombre: string } | null)?.nombre ?? "—"}</TableCell>
                    <TableCell className="text-right">{money(p.monto)}</TableCell>
                    <TableCell>{p.metodo_pago}</TableCell>
                    <TableCell>
                      <Badge variant={p.estado_pago === "Pagado" ? "secondary" : "outline"}>{p.estado_pago}</Badge>
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
