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
import { createTrabajador } from "./actions";

type Option = { id: string; label: string };
type ActionState = { error: string | null };

function labelFor(options: Option[]) {
  return (value: string) => options.find((o) => o.id === value)?.label ?? value;
}

export function TrabajadorForm({ brigadas }: { brigadas: Option[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => createTrabajador(formData),
    { error: null }
  );

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" name="nombre" type="text" required />
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
        <Label htmlFor="rol_trabajo">Rol / oficio (opcional)</Label>
        <Input id="rol_trabajo" name="rol_trabajo" type="text" placeholder="Instalador, ayudante, etc." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipo_pago">Tipo de pago (opcional)</Label>
        <Input id="tipo_pago" name="tipo_pago" type="text" placeholder="Por día, por instalación, etc." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefono">Teléfono (opcional)</Label>
        <Input id="telefono" name="telefono" type="text" />
      </div>

      {state.error ? <p className="text-sm text-destructive sm:col-span-2">{state.error}</p> : null}

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Crear trabajador"}
        </Button>
      </div>
    </form>
  );
}
