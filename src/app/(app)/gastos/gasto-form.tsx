"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createGasto } from "./actions";

type Option = { id: string; label: string };
type ActionState = { error: string | null };

const CATEGORIAS = [
  "Pago Asesor Financiero",
  "Pago Asistente Contable",
  "Alquiler",
  "Combustible",
  "Atención a Trabajadores",
  "Nóminas",
];

function labelFor(options: Option[]) {
  return (value: string) => options.find((o) => o.id === value)?.label ?? value;
}

export function GastoForm({
  proveedores,
  ordenes,
}: {
  proveedores: Option[];
  ordenes: Option[];
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => createGasto(formData),
    { error: null }
  );

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="fecha">Fecha</Label>
        <Input id="fecha" name="fecha" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoria">Categoría</Label>
        <Select name="categoria" required>
          <SelectTrigger id="categoria" className="w-full">
            <SelectValue placeholder="Selecciona" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIAS.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subcategoria">Subcategoría (opcional)</Label>
        <Input id="subcategoria" name="subcategoria" type="text" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="monto">Monto (USD)</Label>
        <Input id="monto" name="monto" type="number" min="0.01" step="0.01" required />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea id="descripcion" name="descripcion" required />
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
        <Label htmlFor="proveedor_id">Proveedor (opcional)</Label>
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

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="orden_relacionada_id">Orden de trabajo relacionada (opcional)</Label>
        <Select name="orden_relacionada_id">
          <SelectTrigger id="orden_relacionada_id" className="w-full">
            <SelectValue placeholder="(Opcional)">{labelFor(ordenes)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {ordenes.map((o) => (
              <SelectItem key={o.id} value={o.id}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {state.error ? <p className="text-sm text-destructive sm:col-span-2">{state.error}</p> : null}

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Registrar gasto"}
        </Button>
      </div>
    </form>
  );
}
