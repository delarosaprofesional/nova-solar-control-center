"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { avanzarEstado, cancelarOrden } from "../actions";

export function EstadoActionButton({
  ordenId,
  nuevoEstado,
  label,
  variant,
}: {
  ordenId: string;
  nuevoEstado: string;
  label: string;
  variant?: "default" | "outline" | "destructive";
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-1">
      <Button
        variant={variant}
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result =
              nuevoEstado === "Cancelada" ? await cancelarOrden(ordenId) : await avanzarEstado(ordenId, nuevoEstado);
            setError(result.error);
          })
        }
      >
        {pending ? "Guardando…" : label}
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
