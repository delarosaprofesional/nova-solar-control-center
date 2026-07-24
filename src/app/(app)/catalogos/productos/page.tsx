import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActivoToggle } from "@/components/nova/activo-toggle";
import { createClient } from "@/lib/supabase/server";
import { ProductoForm } from "./producto-form";
import { toggleActivoProducto } from "./actions";

function money(n: number | null) {
  return n == null ? "—" : n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function ProductosPage() {
  const supabase = await createClient();
  const [{ data: productos, error }, { data: categorias }] = await Promise.all([
    supabase
      .from("productos")
      .select("id, nombre_producto, tipo_producto, unidad_medida, marca, modelo, sku, precio_sugerido, stock_minimo, activo, categorias_producto(nombre)")
      .order("nombre_producto"),
    supabase.from("categorias_producto").select("id, nombre").eq("activo", true).order("nombre"),
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo producto</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductoForm categorias={(categorias ?? []).map((c) => ({ id: c.id, label: c.nombre }))} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">Error al cargar productos: {error.message}</p>
          ) : !productos || productos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Todavía no hay productos.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead className="text-right">Precio Sugerido</TableHead>
                  <TableHead className="text-right">Stock Mín.</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productos.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.nombre_producto}</TableCell>
                    <TableCell>{p.tipo_producto.replaceAll("_", " ")}</TableCell>
                    <TableCell>{(p.categorias_producto as { nombre: string } | null)?.nombre ?? "—"}</TableCell>
                    <TableCell>{p.unidad_medida}</TableCell>
                    <TableCell className="text-right">{money(p.precio_sugerido)}</TableCell>
                    <TableCell className="text-right">{p.stock_minimo}</TableCell>
                    <TableCell>
                      <Badge variant={p.activo ? "secondary" : "outline"}>{p.activo ? "Activo" : "Inactivo"}</Badge>
                    </TableCell>
                    <TableCell>
                      <ActivoToggle id={p.id} activo={p.activo} action={toggleActivoProducto} />
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
