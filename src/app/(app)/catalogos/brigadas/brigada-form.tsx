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
import { createBrigada } from "./actions";

type Option = { id: string; label: string };
type ActionState = { error: string | null };

function labelFor(options: Option[]) {
  return (value: string) => options.find((o) => o.id === value)?.label ?? value;
}

export function BrigadaForm({ usuarios }: { usuarios: Option[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => createBrigada(formData),
    { error: null }
  );

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="nombre_brigada">Nombre</Label>
        <Input id="nombre_brigada" name="nombre_brigada" type="text" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="supervisor_id">Supervisor (opcional)</Label>
        <Select name="supervisor_id">
          <SelectTrigger id="supervisor_id" className="w-full">
            <SelectValue placeholder="(Opcional)">{labelFor(usuarios)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {usuarios.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefono">Teléfono (opcional)</Label>
        <Input id="telefono" name="telefono" type="text" />
      </div>

      {state.error ? <p className="text-sm text-destructive sm:col-span-2">{state.error}</p> : null}

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Crear brigada"}
        </Button>
      </div>
    </form>
  );
}
