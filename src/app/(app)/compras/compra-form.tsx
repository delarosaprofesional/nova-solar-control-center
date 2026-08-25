"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCompra } from "./actions";

type Option = { id: string; label: string };

type ActionState = { error: string | null };

const DRAFT_FIELDS = [
  "fecha",
  "producto_id",
  "cantidad",
  "costo_unitario",
  "proveedor_id",
  "ubicacion_entrada_id",
  "metodo_pago",
  "estado_pago",
  "numero_factura",
] as const;

type CompraDraft = Partial<Record<(typeof DRAFT_FIELDS)[number], string>>;

const DRAFT_KEY = "novasolar:compra-draft";

// Read once, synchronously, before first paint — so restored values can be
// used as <input>/<Select> defaultValue instead of patching the DOM later.
function readDraft(): CompraDraft {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Base UI's <SelectValue> shows the raw value by default; it needs an
// explicit render function to display the matching option's label instead.
function labelFor(options: Option[]) {
  return (value: string) => options.find((o) => o.id === value)?.label ?? value;
}

export function CompraForm({
  productos,
  proveedores,
  ubicaciones,
}: {
  productos: Option[];
  proveedores: Option[];
  ubicaciones: Option[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [draft] = useState<CompraDraft>(readDraft);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => createCompra(formData),
    { error: null }
  );

  // The draft is single-use: once read into state above, clear it so it
  // doesn't reappear on a later, unrelated visit to this page.
  useEffect(() => {
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
  }, []);

  function saveDraftBeforeLeaving() {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const next: CompraDraft = {};
    for (const field of DRAFT_FIELDS) {
      const value = fd.get(field);
      if (typeof value === "string" && value) next[field] = value;
    }
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next));
    } catch {
      // ignore — worst case the draft just isn't restored
    }
  }

  return (
    <form ref={formRef} action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="fecha">Fecha</Label>
        <Input
          id="fecha"
          name="fecha"
          type="date"
          required
          defaultValue={draft.fecha ?? new Date().toISOString().slice(0, 10)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="producto_id">Producto</Label>
          <Link
            href="/catalogos/productos?return_to=/compras"
            onClick={saveDraftBeforeLeaving}
            data-skip-unsaved-guard="true"
            className={buttonVariants({ variant: "outline", size: "xs" })}
          >
            Agregar producto
          </Link>
        </div>
        <Select name="producto_id" required defaultValue={draft.producto_id}>
          <SelectTrigger id="producto_id" className="w-full">
            <SelectValue placeholder="Selecciona un producto">{labelFor(productos)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {productos.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cantidad">Cantidad</Label>
        <Input id="cantidad" name="cantidad" type="number" min="0.01" step="0.01" required defaultValue={draft.cantidad} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="costo_unitario">Costo Unitario (USD)</Label>
        <Input
          id="costo_unitario"
          name="costo_unitario"
          type="number"
          min="0.01"
          step="0.01"
          required
          defaultValue={draft.costo_unitario}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="proveedor_id">Proveedor</Label>
        <Select name="proveedor_id" defaultValue={draft.proveedor_id}>
          <SelectTrigger id="proveedor_id" className="w-full">
            <SelectValue placeholder="(Opcional)">{labelFor(proveedores)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {proveedores.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="ubicacion_entrada_id">Ubicación de entrada</Label>
          <Link
            href="/catalogos/ubicaciones?return_to=/compras"
            onClick={saveDraftBeforeLeaving}
            data-skip-unsaved-guard="true"
            className={buttonVariants({ variant: "outline", size: "xs" })}
          >
            Agregar ubicación
          </Link>
        </div>
        <Select name="ubicacion_entrada_id" required defaultValue={draft.ubicacion_entrada_id}>
          <SelectTrigger id="ubicacion_entrada_id" className="w-full">
            <SelectValue placeholder="Selecciona una ubicación">{labelFor(ubicaciones)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {ubicaciones.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="metodo_pago">Método de pago</Label>
        <Select name="metodo_pago" required defaultValue={draft.metodo_pago}>
          <SelectTrigger id="metodo_pago" className="w-full">
            <SelectValue placeholder="Selecciona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Cash">Cash</SelectItem>
            <SelectItem value="Transferencia">Transferencia</SelectItem>
            <SelectItem value="Tarjeta">Tarjeta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="estado_pago">Estado de pago</Label>
        <Select name="estado_pago" required defaultValue={draft.estado_pago}>
          <SelectTrigger id="estado_pago" className="w-full">
            <SelectValue placeholder="Selecciona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pagado">Pagado</SelectItem>
            <SelectItem value="Pendiente">Pendiente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="numero_factura">Número de factura (opcional)</Label>
        <Input id="numero_factura" name="numero_factura" type="text" defaultValue={draft.numero_factura} />
      </div>

      {state.error ? <p className="text-sm text-destructive sm:col-span-2">{state.error}</p> : null}

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Registrar compra"}
        </Button>
      </div>
    </form>
  );
}
