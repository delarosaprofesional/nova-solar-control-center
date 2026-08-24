"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCompra } from "./actions";

type Option = { id: string; label: string };

type ActionState = { error: string | null };

// Base UI's <SelectValue> shows the raw value by default; it needs an
// explicit render function to display the matching option's label instead.
function labelFor(options: Option[]) {
  return (value: string) => options.find((o) => o.id === value)?.label ?? value;
}

export function CompraForm({
  productos,
  proveedores,
  ubicaciones,
}: {
  productos: Option[];
  proveedores: Option[];
  ubicaciones: Option[];
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => createCompra(formData),
    { error: null }
  );

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="fecha">Fecha</Label>
        <Input id="fecha" name="fecha" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="producto_id">Producto</Label>
          <Link
            href="/catalogos/productos"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", size: "xs" })}
          >
            Agregar producto
          </Link>
        </div>
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
        <Label htmlFor="costo_unitario">Costo Unitario (USD)</Label>
        <Input id="costo_unitario" name="costo_unitario" type="number" min="0.01" step="0.01" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="proveedor_id">Proveedor</Label>
        <Select name="proveedor_id">
          <SelectTrigger id="proveedor_id" className="w-full">
            <SelectValue placeholder="(Opcional)">{labelFor(proveedores)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {proveedores.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="ubicacion_entrada_id">Ubicación de entrada</Label>
          <Link
            href="/catalogos/ubicaciones"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", size: "xs" })}
          >
            Agregar ubicación
          </Link>
        </div>
        <Select name="ubicacion_entrada_id" required>
          <SelectTrigger id="ubicacion_entrada_id" className="w-full">
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

      <div className="space-y-2">
        <Label htmlFor="estado_pago">Estado de pago</Label>
        <Select name="estado_pago" required>
          <SelectTrigger id="estado_pago" className="w-full">
            <SelectValue placeholder="Selecciona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pagado">Pagado</SelectItem>
            <SelectItem value="Pendiente">Pendiente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="numero_factura">Número de factura (opcional)</Label>
        <Input id="numero_factura" name="numero_factura" type="text" />
      </div>

      {state.error ? <p className="text-sm text-destructive sm:col-span-2">{state.error}</p> : null}

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Registrar compra"}
        </Button>
      </div>
    </form>
  );
}
