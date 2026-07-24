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
import { createTransferencia } from "./actions";

type Option = { id: string; label: string };
type ActionState = { error: string | null };

function labelFor(options: Option[]) {
  return (value: string) => options.find((o) => o.id === value)?.label ?? value;
}

export function TransferenciaForm({
  productos,
  ubicaciones,
}: {
  productos: Option[];
  ubicaciones: Option[];
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => createTransferencia(formData),
    { error: null }
  );

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
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
        <Label htmlFor="cantidad">Cantidad</Label>
        <Input id="cantidad" name="cantidad" type="number" min="0.01" step="0.01" required />
      </div>

      <div />

      <div className="space-y-2">
        <Label htmlFor="ubicacion_origen_id">Desde (origen)</Label>
        <Select name="ubicacion_origen_id" required>
          <SelectTrigger id="ubicacion_origen_id" className="w-full">
            <SelectValue placeholder="Selecciona">{labelFor(ubicaciones)}</SelectValue>
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
        <Label htmlFor="ubicacion_destino_id">Hacia (destino)</Label>
        <Select name="ubicacion_destino_id" required>
          <SelectTrigger id="ubicacion_destino_id" className="w-full">
            <SelectValue placeholder="Selecciona">{labelFor(ubicaciones)}</SelectValue>
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

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="notas">Notas (opcional)</Label>
        <Textarea id="notas" name="notas" />
      </div>

      {state.error ? <p className="text-sm text-destructive sm:col-span-2">{state.error}</p> : null}

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Solicitar transferencia"}
        </Button>
      </div>
    </form>
  );
}
