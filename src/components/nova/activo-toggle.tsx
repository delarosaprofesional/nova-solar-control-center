"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";

export function ActivoToggle({
  id,
  activo,
  action,
}: {
  id: string;
  activo: boolean;
  action: (id: string, activo: boolean) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant={activo ? "outline" : "secondary"}
      disabled={pending}
      onClick={() => startTransition(() => action(id, !activo))}
    >
      {activo ? "Desactivar" : "Activar"}
    </Button>
  );
}
