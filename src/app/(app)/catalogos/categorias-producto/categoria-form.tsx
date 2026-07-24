"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategoriaProducto } from "./actions";

type ActionState = { error: string | null };

export function CategoriaProductoForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => createCategoriaProducto(formData),
    { error: null }
  );

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" name="nombre" type="text" required placeholder="Cable, Conectores, Estructura, etc." />
      </div>

      {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Guardando…" : "Crear categoría"}
      </Button>
    </form>
  );
}
