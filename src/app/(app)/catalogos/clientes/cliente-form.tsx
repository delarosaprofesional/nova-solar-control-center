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
import { createCliente } from "./actions";

type ActionState = { error: string | null };

export function ClienteForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => createCliente(formData),
    { error: null }
  );

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="nombre_cliente">Nombre</Label>
        <Input id="nombre_cliente" name="nombre_cliente" type="text" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefono">Teléfono (opcional)</Label>
        <Input id="telefono" name="telefono" type="text" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo (opcional)</Label>
        <Input id="email" name="email" type="email" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipo_cliente">Tipo de cliente (opcional)</Label>
        <Select name="tipo_cliente">
          <SelectTrigger id="tipo_cliente" className="w-full">
            <SelectValue placeholder="Selecciona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Residencial">Residencial</SelectItem>
            <SelectItem value="Comercial">Comercial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fuente">Fuente (opcional)</Label>
        <Input id="fuente" name="fuente" type="text" placeholder="Referido, redes, etc." />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="direccion">Dirección (opcional)</Label>
        <Input id="direccion" name="direccion" type="text" />
      </div>

      {state.error ? <p className="text-sm text-destructive sm:col-span-2">{state.error}</p> : null}

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Crear cliente"}
        </Button>
      </div>
    </form>
  );
}
