"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cerrarCobro } from "../actions";

type ActionState = { error: string | null };

export function CobroForm({ ordenId }: { ordenId: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => cerrarCobro(formData),
    { error: null }
  );

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-4">
      <input type="hidden" name="orden_id" value={ordenId} />
      <div className="space-y-2">
        <Select name="estado_cobro" required>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Estado de cobro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pagado">Pagado</SelectItem>
            <SelectItem value="Pendiente">Pendiente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Guardando…" : "Cerrar cobro"}
      </Button>
    </form>
  );
}
