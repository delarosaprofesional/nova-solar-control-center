import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCurrentUserContext } from "@/lib/nova/current-user";
import { createClient } from "@/lib/supabase/server";
import { TransferenciaForm } from "./transferencia-form";
import { TransferenciaAcciones } from "./estado-acciones";

function EstadoBadge({ estado }: { estado: string }) {
  if (estado === "Confirmada") return <Badge variant="secondary">Confirmada</Badge>;
  if (estado === "Rechazada") return <Badge variant="destructive">Rechazada</Badge>;
  return <Badge variant="outline">Solicitada</Badge>;
}

export default async function TransferenciasPage() {
  const ctx = await getCurrentUserContext();
  const supabase = await createClient();
  const puedeSolicitar = ctx?.rol === "Administrador" || ctx?.rol === "Tienda" || ctx?.rol === "Almacén";
  const puedeConfirmar = ctx?.rol === "Administrador" || ctx?.rol === "Supervisor";

  const [{ data: transferencias, error }, { data: productos }, { data: ubicaciones }] = await Promise.all([
    supabase
      .from("transferencias")
      .select(
        "id, fecha_solicitud, cantidad, estado, productos(nombre_producto), origen:ubicaciones!transferencias_ubicacion_origen_id_fkey(nombre_ubicacion), destino:ubicaciones!transferencias_ubicacion_destino_id_fkey(nombre_ubicacion)"
      )
      .order("fecha_solicitud", { ascending: false }),
    supabase.from("productos").select("id, nombre_producto").eq("activo", true).order("nombre_producto"),
    supabase.from("ubicaciones").select("id, nombre_ubicacion").eq("activa", true).order("nombre_ubicacion"),
  ]);

  return (
    <div className="space-y-6">
      {puedeSolicitar ? (
        <Card>
          <CardHeader>
            <CardTitle>Solicitar transferencia entre ubicaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <TransferenciaForm
              productos={(productos ?? []).map((p) => ({ id: p.id, label: p.nombre_producto }))}
              ubicaciones={(ubicaciones ?? []).map((u) => ({ id: u.id, label: u.nombre_ubicacion }))}
            />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Transferencias</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">Error al cargar transferencias: {error.message}</p>
          ) : !transferencias || transferencias.length === 0 ? (
            <p className="text-sm text-muted-foreground">Todavía no hay transferencias.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead>Desde</TableHead>
                  <TableHead>Hacia</TableHead>
                  <TableHead>Estado</TableHead>
                  {puedeConfirmar ? <TableHead></TableHead> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {transferencias.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.fecha_solicitud}</TableCell>
                    <TableCell className="font-medium">
                      {(t.productos as { nombre_producto: string } | null)?.nombre_producto}
                    </TableCell>
                    <TableCell className="text-right">{t.cantidad}</TableCell>
                    <TableCell>{(t.origen as { nombre_ubicacion: string } | null)?.nombre_ubicacion}</TableCell>
                    <TableCell>{(t.destino as { nombre_ubicacion: string } | null)?.nombre_ubicacion}</TableCell>
                    <TableCell>
                      <EstadoBadge estado={t.estado} />
                    </TableCell>
                    {puedeConfirmar ? (
                      <TableCell>{t.estado === "Solicitada" ? <TransferenciaAcciones id={t.id} /> : null}</TableCell>
                    ) : null}
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
