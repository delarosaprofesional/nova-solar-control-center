"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createVenta } from "./actions";

type Option = { id: string; label: string };

type ActionState = { error: string | null };

// Base UI's <SelectValue> shows the raw value by default; it needs an
// explicit render function to display the matching option's label instead.
function labelFor(options: Option[]) {
  return (value: string) => options.find((o) => o.id === value)?.label ?? value;
}

export function VentaForm({
  productos,
  clientes,
  ubicaciones,
}: {
  productos: Option[];
  clientes: Option[];
  ubicaciones: Option[];
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => createVenta(formData),
    { error: null }
  );

  const ubicacionFija = ubicaciones.length === 1 ? ubicaciones[0] : null;

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="fecha">Fecha</Label>
        <Input id="fecha" name="fecha" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
      </div>

      <div className="space-y-2">
        <Label>Punto de venta</Label>
        {ubicacionFija ? (
          <>
            <Input value={ubicacionFija.label} disabled />
            <input type="hidden" name="punto_venta_id" value={ubicacionFija.id} />
          </>
        ) : (
          <Select name="punto_venta_id" required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una ubicación">{labelFor(ubicaciones)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {ubicaciones.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cliente_id">Cliente</Label>
        <Select name="cliente_id" required>
          <SelectTrigger id="cliente_id" className="w-full">
            <SelectValue placeholder="Selecciona un cliente">{labelFor(clientes)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {clientes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="producto_id">Producto</Label>
        <Select name="producto_id" required>
          <SelectTrigger id="producto_id" className="w-full">
            <SelectValue placeholder="Selecciona un producto">{labelFor(productos)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {productos.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cantidad">Cantidad</Label>
        <Input id="cantidad" name="cantidad" type="number" min="0.01" step="0.01" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="precio_unitario">Precio unitario (USD)</Label>
        <Input id="precio_unitario" name="precio_unitario" type="number" min="0.01" step="0.01" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="metodo_pago">Método de pago</Label>
        <Select name="metodo_pago" required>
          <SelectTrigger id="metodo_pago" className="w-full">
            <SelectValue placeholder="Selecciona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Cash">Cash</SelectItem>
            <SelectItem value="Transferencia">Transferencia</SelectItem>
            <SelectItem value="Tarjeta">Tarjeta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {state.error ? <p className="text-sm text-destructive sm:col-span-2">{state.error}</p> : null}

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Registrar venta"}
        </Button>
      </div>
    </form>
  );
}
