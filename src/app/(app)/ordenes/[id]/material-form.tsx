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
import { addMaterialLine } from "../actions";

type Option = { id: string; label: string };
type ActionState = { error: string | null };

function labelFor(options: Option[]) {
  return (value: string) => options.find((o) => o.id === value)?.label ?? value;
}

export function MaterialForm({
  ordenId,
  productos,
  ubicaciones,
}: {
  ordenId: string;
  productos: Option[];
  ubicaciones: Option[];
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => addMaterialLine(formData),
    { error: null }
  );

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-4">
      <input type="hidden" name="orden_id" value={ordenId} />

      <div className="space-y-2 sm:col-span-2">
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
        <Label htmlFor="cantidad_asignada">Cantidad</Label>
        <Input id="cantidad_asignada" name="cantidad_asignada" type="number" min="0.01" step="0.01" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ubicacion_salida_id">Sale de</Label>
        <Select name="ubicacion_salida_id" required>
          <SelectTrigger id="ubicacion_salida_id" className="w-full">
            <SelectValue placeholder="Ubicación">{labelFor(ubicaciones)}</SelectValue>
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

      {state.error ? <p className="text-sm text-destructive sm:col-span-4">{state.error}</p> : null}

      <div className="sm:col-span-4">
        <Button type="submit" disabled={pending} variant="outline">
          {pending ? "Agregando…" : "Agregar renglón"}
        </Button>
      </div>
    </form>
  );
}
