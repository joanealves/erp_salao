"use client";

import { useState } from "react";
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
  LogOut 
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
  const pathname = usePathname();
  
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
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href="/admin" className="font-bold text-lg">
              Salão Admin
            </Link>
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
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <div className={cn(
                      "mr-3",
                      isActive ? "text-primary" : "text-gray-500"
                    )}>
                      {item.icon}
                    </div>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="p-4 border-t">
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-600"
              onClick={() => console.log("Logout clicked")}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 w-full overflow-y-auto">
        <header className="h-16 border-b flex items-center px-4 lg:px-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-auto flex items-center space-x-4">
            <div className="relative">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                A
              </span>
            </div>
          </div>
        </header>
        
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
