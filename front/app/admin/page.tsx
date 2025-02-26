"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { CalendarDays, Users, Scissors, DollarSign, Clock } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingAppointments: 0,
    totalClients: 0,
    revenue: 0,
  });

  useEffect(() => {
    // Fetch dashboard stats from API
    const fetchStats = async () => {
      try {
        // These would be API calls to your Python backend
        // const response = await fetch('http://localhost:8000/stats');
        // const data = await response.json();
        
        // For now, using mock data
        setStats({
          todayAppointments: 8,
          pendingAppointments: 12,
          totalClients: 145,
          revenue: 2500,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 flex items-center shadow-md">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <CalendarDays className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Agendamentos Hoje</p>
            <p className="text-2xl font-bold">{stats.todayAppointments}</p>
          </div>
        </Card>
        
        <Card className="p-6 flex items-center shadow-md">
          <div className="rounded-full bg-amber-100 p-3 mr-4">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pendentes</p>
            <p className="text-2xl font-bold">{stats.pendingAppointments}</p>
          </div>
        </Card>
        
        <Card className="p-6 flex items-center shadow-md">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total de Clientes</p>
            <p className="text-2xl font-bold">{stats.totalClients}</p>
          </div>
        </Card>
        
        <Card className="p-6 flex items-center shadow-md">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <DollarSign className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Faturamento Mensal</p>
            <p className="text-2xl font-bold">R$ {stats.revenue}</p>
          </div>
        </Card>
      </div>
      
      {/* Quick Access */}
      <h2 className="text-xl font-semibold mb-4">Acesso Rápido</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/admin/appointments">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center mb-2">
              <CalendarDays className="h-5 w-5 mr-2 text-blue-600" />
              <h3 className="font-semibold">Agendamentos</h3>
            </div>
            <p className="text-sm text-gray-500">Gerenciar agendamentos e horários</p>
          </Card>
        </Link>
        
        <Link href="/admin/clients">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 mr-2 text-green-600" />
              <h3 className="font-semibold">Clientes</h3>
            </div>
            <p className="text-sm text-gray-500">Gerenciar cadastro de clientes</p>
          </Card>
        </Link>
        
        <Link href="/admin/services">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center mb-2">
              <Scissors className="h-5 w-5 mr-2 text-purple-600" />
              <h3 className="font-semibold">Serviços</h3>
            </div>
            <p className="text-sm text-gray-500">Gerenciar catálogo de serviços</p>
          </Card>
        </Link>
      </div>
      
      {/* Recent Activity (placeholder) */}
      <h2 className="text-xl font-semibold mb-4">Atividades Recentes</h2>
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="mr-4 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm">
                <span className="font-medium">Maria Silva</span> agendou um 
                <span className="font-medium"> Corte de Cabelo</span> para hoje às 14:30
              </p>
              <p className="text-xs text-gray-500">10 minutos atrás</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-4 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm">
                <span className="font-medium">João Pereira</span> cadastrou-se como novo cliente
              </p>
              <p className="text-xs text-gray-500">35 minutos atrás</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-4 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm">
                <span className="font-medium">Ana Souza</span> concluiu um serviço de 
                <span className="font-medium"> Hidratação</span> no valor de <span className="font-medium">R$ 120,00</span>
              </p>
              <p className="text-xs text-gray-500">1 hora atrás</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}