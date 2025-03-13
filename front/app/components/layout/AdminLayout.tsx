"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  // Verifica o tamanho da tela para definir o estado inicial em dispositivos móveis
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Configura o estado inicial

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Agendamentos",
      href: "/admin/appointments",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: "Clientes",
      href: "/admin/clients",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Serviços",
      href: "/admin/services",
      icon: <Scissors className="h-5 w-5" />,
    },
    {
      name: "Relatórios",
      href: "/admin/reports",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Configurações",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile menu button - float on top left corner */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden bg-white shadow-md"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white border-r transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          sidebarCollapsed ? "lg:w-20" : "lg:w-64",
          "w-64" // Width for mobile
        )}
      >
        <div className="flex flex-col h-full">
          <div className={cn(
            "flex items-center h-16 px-4 border-b",
            sidebarCollapsed ? "justify-center" : "justify-between"
          )}>
            {!sidebarCollapsed && (
              <Link href="/admin" className="font-bold text-lg truncate">
                Salão Admin
              </Link>
            )}
            {sidebarCollapsed && (
              <Link href="/admin" className="font-bold text-lg">
                SA
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href ||
                  (pathname?.startsWith(item.href) && item.href !== "/admin");

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                      sidebarCollapsed ? "justify-center" : ""
                    )}
                    title={sidebarCollapsed ? item.name : ""}
                  >
                    <div className={cn(
                      isActive ? "text-primary" : "text-gray-500",
                      sidebarCollapsed ? "" : "mr-3"
                    )}>
                      {item.icon}
                    </div>
                    {!sidebarCollapsed && item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className={cn(
            "p-4 border-t",
            sidebarCollapsed ? "flex justify-center" : ""
          )}>
            {sidebarCollapsed ? (
              <Button
                variant="outline"
                size="icon"
                className="text-red-600"
                onClick={() => console.log("Logout clicked")}
                title="Sair"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full justify-start text-red-600"
                onClick={() => console.log("Logout clicked")}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Toggle button for desktop */}
      <div className="hidden lg:block absolute left-0 top-1/2 transform -translate-y-1/2 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={cn(
            "rounded-full bg-white shadow-md h-6 w-6 p-0 border",
            sidebarCollapsed ? "ml-16" : "ml-64"
          )}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Main content - without header */}
      <div className="flex flex-col flex-1 w-full overflow-y-auto">
        <main className="flex-1 p-4 pt-16 lg:pt-4">
          {children}
        </main>
      </div>
    </div>
  );
}