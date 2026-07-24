import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUserContext } from "@/lib/nova/current-user";
import { createClient } from "@/lib/supabase/server";

function money(n: number | null) {
  return (n ?? 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

type Metricas = {
  ingresos_ventas_tienda: number;
  compras_totales: number;
  gastos_totales: number;
  ordenes_activas: number;
  ordenes_terminadas: number;
  pagos_brigadas_pendientes_conteo: number;
  pagos_brigadas_pendientes_monto: number;
};

export default async function DashboardPage() {
  const ctx = await getCurrentUserContext();
  if (ctx?.rol !== "Administrador" && ctx?.rol !== "Dueño") redirect("/");

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("fn_dashboard_metricas").single<Metricas>();

  if (error || !data) {
    return <p className="text-sm text-destructive">Error al cargar el dashboard: {error?.message}</p>;
  }

  const utilidadBruta = data.ingresos_ventas_tienda - data.compras_totales - data.gastos_totales;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard ejecutivo</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-normal text-muted-foreground">Ingresos Ventas Tienda</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{money(data.ingresos_ventas_tienda)}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-normal text-muted-foreground">Compras Totales</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{money(data.compras_totales)}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-normal text-muted-foreground">Gastos Totales</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{money(data.gastos_totales)}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-normal text-muted-foreground">Órdenes Activas</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{data.ordenes_activas}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-normal text-muted-foreground">Órdenes Terminadas</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{data.ordenes_terminadas}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-normal text-muted-foreground">Pagos a Brigadas Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{money(data.pagos_brigadas_pendientes_monto)}</p>
            <p className="text-sm text-muted-foreground">{data.pagos_brigadas_pendientes_conteo} pago(s) sin pagar</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-normal text-muted-foreground">Utilidad bruta (Ventas − Compras − Gastos)</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">{money(utilidadBruta)}</CardContent>
      </Card>
    </div>
  );
}
