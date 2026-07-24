import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActivoToggle } from "@/components/nova/activo-toggle";
import { createClient } from "@/lib/supabase/server";
import { ProveedorForm } from "./proveedor-form";
import { toggleActivoProveedor } from "./actions";

export default async function ProveedoresPage() {
  const supabase = await createClient();
  const { data: proveedores, error } = await supabase
    .from("proveedores")
    .select("id, nombre_proveedor, contacto, telefono, email, condiciones_pago, activo")
    .order("nombre_proveedor");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo proveedor</CardTitle>
        </CardHeader>
        <CardContent>
          <ProveedorForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Proveedores</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">Error al cargar proveedores: {error.message}</p>
          ) : !proveedores || proveedores.length === 0 ? (
            <p className="text-sm text-muted-foreground">Todavía no hay proveedores.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Condiciones</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proveedores.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.nombre_proveedor}</TableCell>
                    <TableCell>{p.contacto ?? "—"}</TableCell>
                    <TableCell>{p.telefono ?? "—"}</TableCell>
                    <TableCell>{p.email ?? "—"}</TableCell>
                    <TableCell>{p.condiciones_pago ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={p.activo ? "secondary" : "outline"}>{p.activo ? "Activo" : "Inactivo"}</Badge>
                    </TableCell>
                    <TableCell>
                      <ActivoToggle id={p.id} activo={p.activo} action={toggleActivoProveedor} />
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
