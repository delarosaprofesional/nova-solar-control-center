import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActivoToggle } from "@/components/nova/activo-toggle";
import { createClient } from "@/lib/supabase/server";
import { ClienteForm } from "./cliente-form";
import { toggleActivoCliente } from "./actions";

export default async function ClientesPage() {
  const supabase = await createClient();
  const { data: clientes, error } = await supabase
    .from("clientes")
    .select("id, nombre_cliente, telefono, email, tipo_cliente, fuente, activo")
    .order("nombre_cliente");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <ClienteForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">Error al cargar clientes: {error.message}</p>
          ) : !clientes || clientes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Todavía no hay clientes.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fuente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.nombre_cliente}</TableCell>
                    <TableCell>{c.telefono ?? "—"}</TableCell>
                    <TableCell>{c.email ?? "—"}</TableCell>
                    <TableCell>{c.tipo_cliente ?? "—"}</TableCell>
                    <TableCell>{c.fuente ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={c.activo ? "secondary" : "outline"}>{c.activo ? "Activo" : "Inactivo"}</Badge>
                    </TableCell>
                    <TableCell>
                      <ActivoToggle id={c.id} activo={c.activo} action={toggleActivoCliente} />
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
