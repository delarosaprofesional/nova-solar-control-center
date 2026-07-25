import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserContext } from "@/lib/nova/current-user";

const SUBNAV = [
  { href: "/catalogos/productos", label: "Productos" },
  { href: "/catalogos/categorias-producto", label: "Categorías de Producto" },
  { href: "/catalogos/proveedores", label: "Proveedores" },
  { href: "/catalogos/clientes", label: "Clientes" },
  { href: "/catalogos/ubicaciones", label: "Ubicaciones" },
  { href: "/catalogos/brigadas", label: "Brigadas" },
  { href: "/catalogos/trabajadores", label: "Trabajadores" },
];

export default async function CatalogosLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getCurrentUserContext();
  if (ctx?.rol !== "Administrador" && ctx?.rol !== "Supervisor") redirect("/");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Catálogos</h1>
        <nav className="mt-3 flex flex-wrap gap-2 border-b pb-3">
          {SUBNAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </div>
  );
}
