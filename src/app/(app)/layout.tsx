import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getCurrentUserContext } from "@/lib/nova/current-user";
import { signOut } from "@/app/login/actions";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", roles: ["Administrador", "Dueño"] },
  { href: "/", label: "Inventario", roles: ["Administrador", "Dueño", "Almacén", "Tienda"] },
  { href: "/compras", label: "Compras", roles: ["Administrador", "Almacén", "Contabilidad", "Dueño"] },
  { href: "/ventas", label: "Ventas", roles: ["Administrador", "Dueño", "Contabilidad", "Tienda"] },
  { href: "/ordenes", label: "Órdenes", roles: ["Administrador", "Dueño", "Contabilidad", "Supervisor"] },
  { href: "/pagos-brigadas", label: "Pagos Brigadas", roles: ["Administrador", "Dueño", "Contabilidad"] },
  { href: "/gastos", label: "Gastos", roles: ["Administrador", "Dueño", "Contabilidad"] },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getCurrentUserContext();
  if (!ctx) redirect("/login");

  const visibleLinks = NAV_LINKS.filter((l) => ctx.rol && l.roles.includes(ctx.rol));

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-6">
            <span className="font-semibold">Nova Solar</span>
            <nav className="flex items-center gap-4 text-sm">
              {visibleLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">
              {ctx.nombre ?? ctx.email} · {ctx.rol ?? "sin rol"}
            </span>
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm">
                Salir
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
