import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActivoToggle } from "@/components/nova/activo-toggle";
import { createClient } from "@/lib/supabase/server";
import { CategoriaProductoForm } from "./categoria-form";
import { toggleActivoCategoriaProducto } from "./actions";

export default async function CategoriasProductoPage() {
  const supabase = await createClient();
  const { data: categorias, error } = await supabase
    .from("categorias_producto")
    .select("id, nombre, activo")
    .order("nombre");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nueva categoría de producto</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoriaProductoForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categorías de producto</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">Error al cargar categorías: {error.message}</p>
          ) : !categorias || categorias.length === 0 ? (
            <p className="text-sm text-muted-foreground">Todavía no hay categorías.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categorias.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.nombre}</TableCell>
                    <TableCell>
                      <Badge variant={c.activo ? "secondary" : "outline"}>{c.activo ? "Activa" : "Inactiva"}</Badge>
                    </TableCell>
                    <TableCell>
                      <ActivoToggle id={c.id} activo={c.activo} action={toggleActivoCategoriaProducto} />
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
