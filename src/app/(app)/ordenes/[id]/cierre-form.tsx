"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { guardarCierre } from "../actions";

type Linea = {
  id: string;
  nombreProducto: string;
  cantidadAsignada: number;
  costoUnitario: number;
};

type ActionState = { error: string | null };

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function CierreForm({ ordenId, lineas }: { ordenId: string; lineas: Linea[] }) {
  const [valores, setValores] = useState<Record<string, { utilizada: string; devuelta: string; precio: string }>>(
    () =>
      Object.fromEntries(
        lineas.map((l) => [l.id, { utilizada: String(l.cantidadAsignada), devuelta: "0", precio: "" }])
      )
  );
  const [costoManoObra, setCostoManoObra] = useState("0");
  const [otrosCostos, setOtrosCostos] = useState("0");

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => guardarCierre(formData),
    { error: null }
  );

  const calculado = useMemo(() => {
    let sumaPrecioTotal = 0;
    const porLinea = lineas.map((l) => {
      const v = valores[l.id];
      const utilizada = Number(v?.utilizada || 0);
      const precio = Number(v?.precio || 0);
      const precioTotal = utilizada * precio;
      const utilidad = precioTotal - utilizada * l.costoUnitario;
      sumaPrecioTotal += precioTotal;
      return { ...l, utilizada, precioTotal, utilidad };
    });
    const manoObra = Number(costoManoObra || 0);
    const otros = Number(otrosCostos || 0);
    const precioCobrado = sumaPrecioTotal + manoObra + otros;
    return { porLinea, precioCobrado };
  }, [lineas, valores, costoManoObra, otrosCostos]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="orden_id" value={ordenId} />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead className="text-right">Asignado</TableHead>
            <TableHead className="text-right">Utilizado</TableHead>
            <TableHead className="text-right">Devuelto</TableHead>
            <TableHead className="text-right">Costo Unit. (solo lectura)</TableHead>
            <TableHead className="text-right">Precio Cliente</TableHead>
            <TableHead className="text-right">Utilidad línea</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calculado.porLinea.map((l) => (
            <TableRow key={l.id}>
              <TableCell className="font-medium">{l.nombreProducto}</TableCell>
              <TableCell className="text-right">{l.cantidadAsignada}</TableCell>
              <TableCell className="text-right">
                <input type="hidden" name="linea_id" value={l.id} />
                <Input
                  className="w-24 text-right"
                  type="number"
                  min="0"
                  step="0.01"
                  name={`utilizada_${l.id}`}
                  value={valores[l.id]?.utilizada ?? ""}
                  onChange={(e) =>
                    setValores((prev) => ({ ...prev, [l.id]: { ...prev[l.id], utilizada: e.target.value } }))
                  }
                  required
                />
              </TableCell>
              <TableCell className="text-right">
                <Input
                  className="w-24 text-right"
                  type="number"
                  min="0"
                  step="0.01"
                  name={`devuelta_${l.id}`}
                  value={valores[l.id]?.devuelta ?? "0"}
                  onChange={(e) =>
                    setValores((prev) => ({ ...prev, [l.id]: { ...prev[l.id], devuelta: e.target.value } }))
                  }
                />
              </TableCell>
              <TableCell className="text-right text-muted-foreground">{money(l.costoUnitario)}</TableCell>
              <TableCell className="text-right">
                <Input
                  className="w-28 text-right"
                  type="number"
                  min="0.01"
                  step="0.01"
                  name={`precio_${l.id}`}
                  value={valores[l.id]?.precio ?? ""}
                  onChange={(e) =>
                    setValores((prev) => ({ ...prev, [l.id]: { ...prev[l.id], precio: e.target.value } }))
                  }
                  required
                />
              </TableCell>
              <TableCell className="text-right font-medium">{money(l.utilidad)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="costo_mano_obra">Costo de mano de obra (USD)</Label>
          <Input
            id="costo_mano_obra"
            name="costo_mano_obra"
            type="number"
            min="0"
            step="0.01"
            value={costoManoObra}
            onChange={(e) => setCostoManoObra(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="otros_costos">Otros costos (USD)</Label>
          <Input
            id="otros_costos"
            name="otros_costos"
            type="number"
            min="0"
            step="0.01"
            value={otrosCostos}
            onChange={(e) => setOtrosCostos(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Precio Cobrado (en vivo)</Label>
          <p className="text-2xl font-semibold">{money(calculado.precioCobrado)}</p>
        </div>
      </div>

      {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Guardando…" : "Cerrar orden"}
      </Button>
    </form>
  );
}
