"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Scissors,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

type SidebarProps = {
  className?: string;
};

const routes = [
  {
    href: "/admin",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/admin/appointments",
    icon: CalendarDays,
    label: "Agendamentos",
  },
  {
    href: "/admin/clients",
    icon: Users,
    label: "Clientes",
  },
  {
    href: "/admin/services",
    icon: Scissors,
    label: "Serviços",
  },
  {
    href: "/admin/reports",
    icon: BarChart3,
    label: "Relatórios",
  },
  {
    href: "/admin/settings",
    icon: Settings,
    label: "Configurações",
  },
];


export function AdminSidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  useEffect(() => {
    console.log("AdminSidebar mounted");
    return () => console.log("AdminSidebar unmounted");
  }, []);

  return (
    <div className={cn(
      "flex flex-col h-full bg-white border-r transition-all",
      collapsed ? "w-[70px]" : "w-[240px]",
      className
    )}>
      <div className="p-4 flex justify-between items-center">
        {!collapsed && (
          <Link href="/admin" className="font-bold text-xl">
            BarberApp
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>

      <div className="flex-1 py-4">
        <nav className="px-2 space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md transition-colors",
                pathname === route.href || pathname.startsWith(`${route.href}/`)
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100",
                collapsed && "justify-center"
              )}
            >
              <route.icon size={20} />
              {!collapsed && <span>{route.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full flex items-center justify-start gap-x-2",
            collapsed && "justify-center"
          )}
        >
          <LogOut size={20} />
          {!collapsed && <span>Sair</span>}
        </Button>
      </div>
    </div>
  );
}
export default AdminSidebar;