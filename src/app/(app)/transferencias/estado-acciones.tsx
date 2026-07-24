"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { confirmarTransferencia, rechazarTransferencia } from "./actions";

export function TransferenciaAcciones({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await confirmarTransferencia(id);
            setError(result.error);
          })
        }
      >
        Confirmar
      </Button>
      <Button
        size="sm"
        variant="destructive"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await rechazarTransferencia(id);
            setError(result.error);
          })
        }
      >
        Rechazar
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
