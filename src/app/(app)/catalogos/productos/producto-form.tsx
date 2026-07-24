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
import { createProducto } from "./actions";

type Option = { id: string; label: string };
type ActionState = { error: string | null };

function labelFor(options: Option[]) {
  return (value: string) => options.find((o) => o.id === value)?.label ?? value;
}

export function ProductoForm({ categorias }: { categorias: Option[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => createProducto(formData),
    { error: null }
  );

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="nombre_producto">Nombre</Label>
        <Input id="nombre_producto" name="nombre_producto" type="text" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipo_producto">Tipo</Label>
        <Select name="tipo_producto" required>
          <SelectTrigger id="tipo_producto" className="w-full">
            <SelectValue placeholder="Selecciona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Simple">Simple</SelectItem>
            <SelectItem value="Kit_Fijo">Kit Fijo</SelectItem>
            <SelectItem value="Kit_Personalizado">Kit Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoria_id">Categoría</Label>
        <Select name="categoria_id" required>
          <SelectTrigger id="categoria_id" className="w-full">
            <SelectValue placeholder="Selecciona">{labelFor(categorias)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {categorias.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          ¿Falta la categoría que necesitas? Créala primero en la pestaña &quot;Categorías de Producto&quot;.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="unidad_medida">Unidad de medida</Label>
        <Select name="unidad_medida" required>
          <SelectTrigger id="unidad_medida" className="w-full">
            <SelectValue placeholder="Selecciona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Unidad">Unidad</SelectItem>
            <SelectItem value="Kit">Kit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sku">SKU (opcional)</Label>
        <Input id="sku" name="sku" type="text" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="marca">Marca (opcional)</Label>
        <Input id="marca" name="marca" type="text" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="modelo">Modelo (opcional)</Label>
        <Input id="modelo" name="modelo" type="text" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="precio_sugerido">Precio sugerido (opcional)</Label>
        <Input id="precio_sugerido" name="precio_sugerido" type="number" min="0" step="0.01" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock_minimo">Stock mínimo</Label>
        <Input id="stock_minimo" name="stock_minimo" type="number" min="0" step="1" defaultValue={0} />
      </div>

      {state.error ? <p className="text-sm text-destructive sm:col-span-2">{state.error}</p> : null}

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Crear producto"}
        </Button>
      </div>
    </form>
  );
}
