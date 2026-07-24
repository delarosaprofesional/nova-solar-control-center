"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
import { createOrden } from "./actions";

type Option = { id: string; label: string };
type ActionState = { error: string | null; id?: string };

function labelFor(options: Option[]) {
  return (value: string) => options.find((o) => o.id === value)?.label ?? value;
}

export function OrdenForm({
  clientes,
  brigadas,
  kits,
}: {
  clientes: Option[];
  brigadas: Option[];
  kits: Option[];
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => createOrden(formData),
    { error: null }
  );

  useEffect(() => {
    if (state.id) router.push(`/ordenes/${state.id}`);
  }, [state.id, router]);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="cliente_id">Cliente</Label>
        <Select name="cliente_id" required>
          <SelectTrigger id="cliente_id" className="w-full">
            <SelectValue placeholder="Selecciona un cliente">{labelFor(clientes)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {clientes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefono">Teléfono (opcional)</Label>
        <Input id="telefono" name="telefono" type="text" />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="direccion_trabajo">Dirección de la instalación</Label>
        <Textarea id="direccion_trabajo" name="direccion_trabajo" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipo_instalacion">Tipo de instalación</Label>
        <Select name="tipo_instalacion" required>
          <SelectTrigger id="tipo_instalacion" className="w-full">
            <SelectValue placeholder="Selecciona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Residencial">Residencial</SelectItem>
            <SelectItem value="Comercial">Comercial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="brigada_asignada_id">Brigada asignada</Label>
        <Select name="brigada_asignada_id">
          <SelectTrigger id="brigada_asignada_id" className="w-full">
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

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="kit_contratado_id">Kit contratado (opcional)</Label>
        <Select name="kit_contratado_id">
          <SelectTrigger id="kit_contratado_id" className="w-full">
            <SelectValue placeholder="(Opcional)">{labelFor(kits)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {kits.map((k) => (
              <SelectItem key={k.id} value={k.id}>
                {k.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {state.error ? <p className="text-sm text-destructive sm:col-span-2">{state.error}</p> : null}

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Creando…" : "Crear orden"}
        </Button>
      </div>
    </form>
  );
}
