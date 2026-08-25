"use client";

import { useActionState, useRef } from "react";
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
import { createUbicacion } from "./actions";
import { useReturnToOnSuccess } from "@/lib/nova/use-return-to";

type Option = { id: string; label: string };
type ActionState = { error: string | null };

function labelFor(options: Option[]) {
  return (value: string) => options.find((o) => o.id === value)?.label ?? value;
}

export function UbicacionForm({ usuarios }: { usuarios: Option[] }) {
  const submittedRef = useRef(false);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      submittedRef.current = true;
      return createUbicacion(formData);
    },
    { error: null }
  );
  useReturnToOnSuccess(submittedRef, state);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="nombre_ubicacion">Nombre</Label>
        <Input id="nombre_ubicacion" name="nombre_ubicacion" type="text" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipo_ubicacion">Tipo</Label>
        <Select name="tipo_ubicacion" required>
          <SelectTrigger id="tipo_ubicacion" className="w-full">
            <SelectValue placeholder="Selecciona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Almacén Central">Almacén Central</SelectItem>
            <SelectItem value="Punto de Venta">Punto de Venta</SelectItem>
            <SelectItem value="Reservado">Reservado</SelectItem>
            <SelectItem value="Vehículo/Campo">Vehículo/Campo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="responsable_id">Responsable (opcional)</Label>
        <Select name="responsable_id">
          <SelectTrigger id="responsable_id" className="w-full">
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

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="direccion">Dirección (opcional)</Label>
        <Input id="direccion" name="direccion" type="text" />
      </div>

      {state.error ? <p className="text-sm text-destructive sm:col-span-2">{state.error}</p> : null}

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Crear ubicación"}
        </Button>
      </div>
    </form>
  );
}
