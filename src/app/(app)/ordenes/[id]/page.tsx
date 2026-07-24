import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { EstadoActionButton } from "./estado-button";
import { MaterialForm } from "./material-form";
import { CierreForm } from "./cierre-form";
import { CobroForm } from "./cobro-form";

function money(n: number | null) {
  return (n ?? 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function OrdenDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: orden, error } = await supabase
    .from("ordenes_trabajo")
    .select(
      "id, fecha_creacion, direccion_trabajo, tipo_instalacion, estado, estado_cobro, fecha_inicio, fecha_terminada, costo_mano_obra, otros_costos, costo_materiales_estimado, costo_materiales_real, costo_total, precio_cobrado, utilidad_real, kit_contratado_id, clientes(nombre_cliente, telefono), brigadas(nombre_brigada), productos(tipo_producto)"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !orden) notFound();

  const { data: lineas } = await supabase
    .from("materiales_orden")
    .select("id, cantidad_asignada, cantidad_utilizada, cantidad_devuelta, costo_unitario, precio_unitario_cliente, utilidad_linea, productos(nombre_producto)")
    .eq("orden_id", id)
    .order("fecha");

  const cliente = orden.clientes as { nombre_cliente: string; telefono: string | null } | null;
  const brigada = orden.brigadas as { nombre_brigada: string } | null;
  const kitTipo = (orden.productos as { tipo_producto: string } | null)?.tipo_producto;

  const [{ data: productos }, { data: ubicaciones }] = await Promise.all([
    supabase.from("productos").select("id, nombre_producto").eq("activo", true).order("nombre_producto"),
    supabase.from("ubicaciones").select("id, nombre_ubicacion").eq("activa", true).order("nombre_ubicacion"),
  ]);

  const puedeCancelar = !["Terminada", "Cerrada_Pagada", "Cancelada"].includes(orden.estado);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Orden {orden.id}</CardTitle>
          <Badge variant={orden.estado === "Cancelada" ? "destructive" : "outline"}>
            {orden.estado.replaceAll("_", " ")}
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          <p><span className="text-muted-foreground">Cliente:</span> {cliente?.nombre_cliente}</p>
          <p><span className="text-muted-foreground">Teléfono:</span> {cliente?.telefono ?? "—"}</p>
          <p><span className="text-muted-foreground">Dirección:</span> {orden.direccion_trabajo}</p>
          <p><span className="text-muted-foreground">Tipo:</span> {orden.tipo_instalacion}</p>
          <p><span className="text-muted-foreground">Brigada:</span> {brigada?.nombre_brigada ?? "—"}</p>
          <p><span className="text-muted-foreground">Creada:</span> {orden.fecha_creacion}</p>
        </CardContent>
      </Card>

      {orden.estado === "Solicitada" ? (
        <Card>
          <CardHeader>
            <CardTitle>Solicitar materiales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MaterialForm
              ordenId={orden.id}
              productos={(productos ?? []).map((p) => ({ id: p.id, label: p.nombre_producto }))}
              ubicaciones={(ubicaciones ?? []).map((u) => ({ id: u.id, label: u.nombre_ubicacion }))}
            />
            {lineas && lineas.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Cantidad asignada</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineas.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell>{(l.productos as { nombre_producto: string } | null)?.nombre_producto}</TableCell>
                      <TableCell className="text-right">{l.cantidad_asignada}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">
                {kitTipo === "Kit_Personalizado"
                  ? "Este kit es personalizado: agrega al menos un renglón antes de solicitar materiales."
                  : "Agrega los renglones de materiales antes de solicitar (opcional si la orden no lleva materiales de almacén)."}
              </p>
            )}
            <EstadoActionButton ordenId={orden.id} nuevoEstado="Materiales_Solicitados" label="Solicitar materiales" />
          </CardContent>
        </Card>
      ) : null}

      {orden.estado === "Materiales_Solicitados" ? (
        <Card>
          <CardHeader>
            <CardTitle>Materiales reservados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Cantidad reservada</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(lineas ?? []).map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>{(l.productos as { nombre_producto: string } | null)?.nombre_producto}</TableCell>
                    <TableCell className="text-right">{l.cantidad_asignada}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <EstadoActionButton ordenId={orden.id} nuevoEstado="En_Proceso" label="Iniciar trabajo" />
          </CardContent>
        </Card>
      ) : null}

      {orden.estado === "En_Proceso" ? (
        <Card>
          <CardHeader>
            <CardTitle>Cerrar orden — reportar uso real</CardTitle>
          </CardHeader>
          <CardContent>
            <CierreForm
              ordenId={orden.id}
              lineas={(lineas ?? []).map((l) => ({
                id: l.id,
                nombreProducto: (l.productos as { nombre_producto: string } | null)?.nombre_producto ?? "",
                cantidadAsignada: l.cantidad_asignada,
                costoUnitario: l.costo_unitario,
              }))}
            />
          </CardContent>
        </Card>
      ) : null}

      {["Terminada", "Cerrada_Pagada"].includes(orden.estado) ? (
        <Card>
          <CardHeader>
            <CardTitle>Resumen de cierre</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Utilizado</TableHead>
                  <TableHead className="text-right">Devuelto</TableHead>
                  <TableHead className="text-right">Costo Unit.</TableHead>
                  <TableHead className="text-right">Precio Cliente</TableHead>
                  <TableHead className="text-right">Utilidad línea</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(lineas ?? []).map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>{(l.productos as { nombre_producto: string } | null)?.nombre_producto}</TableCell>
                    <TableCell className="text-right">{l.cantidad_utilizada}</TableCell>
                    <TableCell className="text-right">{l.cantidad_devuelta}</TableCell>
                    <TableCell className="text-right">{money(l.costo_unitario)}</TableCell>
                    <TableCell className="text-right">{money(l.precio_unitario_cliente)}</TableCell>
                    <TableCell className="text-right">{money(l.utilidad_linea)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <p><span className="text-muted-foreground">Costo materiales real:</span> {money(orden.costo_materiales_real)}</p>
              <p><span className="text-muted-foreground">Mano de obra:</span> {money(orden.costo_mano_obra)}</p>
              <p><span className="text-muted-foreground">Otros costos:</span> {money(orden.otros_costos)}</p>
              <p><span className="text-muted-foreground">Costo total:</span> {money(orden.costo_total)}</p>
              <p className="text-base font-semibold"><span className="text-muted-foreground font-normal">Precio cobrado:</span> {money(orden.precio_cobrado)}</p>
              <p className="text-base font-semibold"><span className="text-muted-foreground font-normal">Utilidad real:</span> {money(orden.utilidad_real)}</p>
            </div>

            {orden.estado === "Terminada" ? <CobroForm ordenId={orden.id} /> : (
              <p className="text-sm text-muted-foreground">Estado de cobro: {orden.estado_cobro ?? "—"}</p>
            )}
          </CardContent>
        </Card>
      ) : null}

      {puedeCancelar ? (
        <EstadoActionButton ordenId={orden.id} nuevoEstado="Cancelada" label="Cancelar orden" variant="destructive" />
      ) : null}
    </div>
  );
}
