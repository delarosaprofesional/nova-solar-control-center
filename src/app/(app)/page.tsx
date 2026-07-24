import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/server";

function money(n: number | null) {
  return (n ?? 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function EstadoBadge({ estado }: { estado: string | null }) {
  if (estado === "Sin Stock") return <Badge variant="destructive">Sin Stock</Badge>;
  if (estado === "Stock Bajo")
    return (
      <Badge variant="outline" className="border-amber-500 text-amber-600 dark:text-amber-400">
        Stock Bajo
      </Badge>
    );
  return <Badge variant="secondary">OK</Badge>;
}

async function InventarioTable({ soloCritico }: { soloCritico: boolean }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(soloCritico ? "inventario_critico" : "inventario_actual")
    .select("producto_id, ubicacion_id, disponible, costo_promedio, valor_disponible, stock_minimo, estado_stock, productos(nombre_producto), ubicaciones(nombre_ubicacion)")
    .order("producto_id");

  if (error) {
    return <p className="text-sm text-destructive">Error al cargar inventario: {error.message}</p>;
  }

  if (!data || data.length === 0) {
    return <p className="text-sm text-muted-foreground">Sin registros para mostrar.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead>Ubicación</TableHead>
          <TableHead className="text-right">Disponible</TableHead>
          <TableHead className="text-right">Costo Prom.</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead className="text-right">Stock Mín.</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={`${row.producto_id}-${row.ubicacion_id}`}>
            <TableCell className="font-medium">
              {(row.productos as { nombre_producto: string } | null)?.nombre_producto ?? row.producto_id}
            </TableCell>
            <TableCell>{(row.ubicaciones as { nombre_ubicacion: string } | null)?.nombre_ubicacion ?? row.ubicacion_id}</TableCell>
            <TableCell className="text-right">{row.disponible}</TableCell>
            <TableCell className="text-right">{money(row.costo_promedio)}</TableCell>
            <TableCell className="text-right">{money(row.valor_disponible)}</TableCell>
            <TableCell className="text-right">{row.stock_minimo}</TableCell>
            <TableCell>
              <EstadoBadge estado={row.estado_stock} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function InventarioPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventario Actual</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="todo">
          <TabsList>
            <TabsTrigger value="todo">Todo</TabsTrigger>
            <TabsTrigger value="critico">Inventario Crítico</TabsTrigger>
          </TabsList>
          <TabsContent value="todo" className="mt-4">
            <InventarioTable soloCritico={false} />
          </TabsContent>
          <TabsContent value="critico" className="mt-4">
            <InventarioTable soloCritico={true} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
