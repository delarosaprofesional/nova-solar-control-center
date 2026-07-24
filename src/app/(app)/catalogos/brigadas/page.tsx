import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActivoToggle } from "@/components/nova/activo-toggle";
import { createClient } from "@/lib/supabase/server";
import { BrigadaForm } from "./brigada-form";
import { toggleEstadoBrigada } from "./actions";

export default async function BrigadasPage() {
  const supabase = await createClient();
  const [{ data: brigadas, error }, { data: usuarios }] = await Promise.all([
    supabase
      .from("brigadas")
      .select("id, nombre_brigada, telefono, estado, usuarios!fk_brigadas_supervisor(nombre)")
      .order("nombre_brigada"),
    supabase.from("usuarios").select("id, nombre").eq("activo", true).order("nombre"),
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nueva brigada</CardTitle>
        </CardHeader>
        <CardContent>
          <BrigadaForm usuarios={(usuarios ?? []).map((u) => ({ id: u.id, label: u.nombre }))} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brigadas</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">Error al cargar brigadas: {error.message}</p>
          ) : !brigadas || brigadas.length === 0 ? (
            <p className="text-sm text-muted-foreground">Todavía no hay brigadas.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Supervisor</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brigadas.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.nombre_brigada}</TableCell>
                    <TableCell>{(b.usuarios as { nombre: string } | null)?.nombre ?? "—"}</TableCell>
                    <TableCell>{b.telefono ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={b.estado === "Activa" ? "secondary" : "outline"}>{b.estado ?? "—"}</Badge>
                    </TableCell>
                    <TableCell>
                      <ActivoToggle id={b.id} activo={b.estado === "Activa"} action={toggleEstadoBrigada} />
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
