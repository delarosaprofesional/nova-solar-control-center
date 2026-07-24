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
import { createPagoBrigada } from "./actions";

type Option = { id: string; label: string };
type ActionState = { error: string | null };

function labelFor(options: Option[]) {
  return (value: string) => options.find((o) => o.id === value)?.label ?? value;
}

export function PagoBrigadaForm({
  ordenes,
  brigadas,
  trabajadores,
}: {
  ordenes: Option[];
  brigadas: Option[];
  trabajadores: Option[];
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => createPagoBrigada(formData),
    { error: null }
  );

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="fecha">Fecha</Label>
        <Input id="fecha" name="fecha" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="orden_id">Orden de trabajo</Label>
        <Select name="orden_id" required>
          <SelectTrigger id="orden_id" className="w-full">
            <SelectValue placeholder="Selecciona una orden">{labelFor(ordenes)}</SelectValue>
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

      <div className="space-y-2">
        <Label htmlFor="brigada_id">Brigada (opcional)</Label>
        <Select name="brigada_id">
          <SelectTrigger id="brigada_id" className="w-full">
            <SelectValue placeholder="(Opcional)">{labelFor(brigadas)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {brigadas.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="trabajador_id">Trabajador (opcional)</Label>
        <Select name="trabajador_id">
          <SelectTrigger id="trabajador_id" className="w-full">
            <SelectValue placeholder="(Opcional)">{labelFor(trabajadores)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {trabajadores.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="monto">Monto (USD)</Label>
        <Input id="monto" name="monto" type="number" min="0.01" step="0.01" required />
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

      <div className="space-y-2">
        <Label htmlFor="fecha_pago">Fecha de pago (si ya está Pagado)</Label>
        <Input id="fecha_pago" name="fecha_pago" type="date" />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="notas">Notas (opcional)</Label>
        <Textarea id="notas" name="notas" />
      </div>

      {state.error ? <p className="text-sm text-destructive sm:col-span-2">{state.error}</p> : null}

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Registrar pago"}
        </Button>
      </div>
    </form>
  );
}
