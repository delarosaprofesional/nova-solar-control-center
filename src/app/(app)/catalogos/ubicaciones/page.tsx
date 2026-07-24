import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActivoToggle } from "@/components/nova/activo-toggle";
import { createClient } from "@/lib/supabase/server";
import { UbicacionForm } from "./ubicacion-form";
import { toggleActivaUbicacion } from "./actions";

export default async function UbicacionesPage() {
  const supabase = await createClient();
  const [{ data: ubicaciones, error }, { data: usuarios }] = await Promise.all([
    supabase
      .from("ubicaciones")
      .select("id, nombre_ubicacion, tipo_ubicacion, direccion, activa, usuarios!fk_ubicaciones_responsable(nombre)")
      .order("nombre_ubicacion"),
    supabase.from("usuarios").select("id, nombre").eq("activo", true).order("nombre"),
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nueva ubicación</CardTitle>
        </CardHeader>
        <CardContent>
          <UbicacionForm usuarios={(usuarios ?? []).map((u) => ({ id: u.id, label: u.nombre }))} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ubicaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">Error al cargar ubicaciones: {error.message}</p>
          ) : !ubicaciones || ubicaciones.length === 0 ? (
            <p className="text-sm text-muted-foreground">Todavía no hay ubicaciones.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ubicaciones.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.nombre_ubicacion}</TableCell>
                    <TableCell>{u.tipo_ubicacion}</TableCell>
                    <TableCell>{u.direccion ?? "—"}</TableCell>
                    <TableCell>{(u.usuarios as { nombre: string } | null)?.nombre ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={u.activa ? "secondary" : "outline"}>{u.activa ? "Activa" : "Inactiva"}</Badge>
                    </TableCell>
                    <TableCell>
                      <ActivoToggle id={u.id} activo={u.activa} action={toggleActivaUbicacion} />
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
