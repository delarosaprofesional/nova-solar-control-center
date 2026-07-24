import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActivoToggle } from "@/components/nova/activo-toggle";
import { createClient } from "@/lib/supabase/server";
import { TrabajadorForm } from "./trabajador-form";
import { toggleEstadoTrabajador } from "./actions";

export default async function TrabajadoresPage() {
  const supabase = await createClient();
  const [{ data: trabajadores, error }, { data: brigadas }] = await Promise.all([
    supabase
      .from("trabajadores")
      .select("id, nombre, telefono, rol_trabajo, tipo_pago, estado, brigadas(nombre_brigada)")
      .order("nombre"),
    supabase.from("brigadas").select("id, nombre_brigada").order("nombre_brigada"),
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo trabajador</CardTitle>
        </CardHeader>
        <CardContent>
          <TrabajadorForm brigadas={(brigadas ?? []).map((b) => ({ id: b.id, label: b.nombre_brigada }))} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trabajadores</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">Error al cargar trabajadores: {error.message}</p>
          ) : !trabajadores || trabajadores.length === 0 ? (
            <p className="text-sm text-muted-foreground">Todavía no hay trabajadores.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Brigada</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Tipo de pago</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trabajadores.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.nombre}</TableCell>
                    <TableCell>{(t.brigadas as { nombre_brigada: string } | null)?.nombre_brigada ?? "—"}</TableCell>
                    <TableCell>{t.rol_trabajo ?? "—"}</TableCell>
                    <TableCell>{t.tipo_pago ?? "—"}</TableCell>
                    <TableCell>{t.telefono ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={t.estado === "Activo" ? "secondary" : "outline"}>{t.estado ?? "—"}</Badge>
                    </TableCell>
                    <TableCell>
                      <ActivoToggle id={t.id} activo={t.estado === "Activo"} action={toggleEstadoTrabajador} />
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
