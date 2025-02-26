"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { CalendarDays, Users, Scissors, DollarSign, Clock } from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Activity {
  name: string;
  service: string;
  date: string;
  time: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingAppointments: 0,
    totalClients: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch dashboard stats from API
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/stats`);
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError("Falha ao carregar estatísticas");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>
        <div className="flex justify-center items-center h-64">
          <p>Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

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
      
      {/* Recent Activity */}
      <h2 className="text-xl font-semibold mb-4">Atividades Recentes</h2>
      <RecentActivityCard />
    </div>
  );
}

// Componente de atividades recentes
function RecentActivityCard() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Activity[]>(`${API_URL}/appointments?limit=5&sort=created_at.desc`);
        setActivities(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar atividades recentes:", error);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">Carregando atividades recentes...</p>
      </Card>
    );
  }

  // Se não houver atividades recentes
  if (activities.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">Nenhuma atividade recente encontrada.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start">
            <div className="mr-4 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm">
                <span className="font-medium">{activity.name}</span> agendou um 
                <span className="font-medium"> {activity.service}</span> para {formatDate(activity.date)} às {activity.time}
              </p>
              <p className="text-xs text-gray-500">{formatTimeAgo(activity.created_at)}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Funções auxiliares
function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function formatTimeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return "agora mesmo";
  if (diffInMinutes < 60) return `${diffInMinutes} minutos atrás`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} horas atrás`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} dias atrás`;
}
