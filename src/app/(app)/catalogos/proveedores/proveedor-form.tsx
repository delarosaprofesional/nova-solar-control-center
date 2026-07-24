"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProveedor } from "./actions";

type ActionState = { error: string | null };

export function ProveedorForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => createProveedor(formData),
    { error: null }
  );

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="nombre_proveedor">Nombre</Label>
        <Input id="nombre_proveedor" name="nombre_proveedor" type="text" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contacto">Contacto (opcional)</Label>
        <Input id="contacto" name="contacto" type="text" />
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
        <Label htmlFor="condiciones_pago">Condiciones de pago (opcional)</Label>
        <Input id="condiciones_pago" name="condiciones_pago" type="text" />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="direccion">Dirección (opcional)</Label>
        <Input id="direccion" name="direccion" type="text" />
      </div>

      {state.error ? <p className="text-sm text-destructive sm:col-span-2">{state.error}</p> : null}

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Crear proveedor"}
        </Button>
      </div>
    </form>
  );
}
