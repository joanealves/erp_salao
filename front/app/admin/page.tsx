"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CalendarDays, Users, Scissors, DollarSign, Clock } from "lucide-react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
          <Skeleton className="h-6 w-40" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const data = [
    { name: "Jan", Agendamentos: 40 },
    { name: "Fev", Agendamentos: 30 },
    { name: "Mar", Agendamentos: 20 },
    { name: "Abr", Agendamentos: 27 },
    { name: "Mai", Agendamentos: 18 },
    { name: "Jun", Agendamentos: 23 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={CalendarDays} title="Agendamentos Hoje" value={stats.todayAppointments} color="blue" />
        <StatCard icon={Clock} title="Pendentes" value={stats.pendingAppointments} color="amber" />
        <StatCard icon={Users} title="Total de Clientes" value={stats.totalClients} color="green" />
        <StatCard icon={DollarSign} title="Faturamento Mensal" value={`R$ ${stats.revenue}`} color="purple" />
      </div>
      <Card className="p-6 mb-8">
        <CardHeader>
          <CardTitle>Agendamentos Mensais</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart width={600} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Agendamentos" stroke="#8884d8" />
          </LineChart>
        </CardContent>
      </Card>
      <h2 className="text-xl font-semibold mb-4">Acesso Rápido</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <QuickAccessCard href="/admin/appointments" icon={CalendarDays} title="Agendamentos" description="Gerenciar agendamentos e horários" color="blue" />
        <QuickAccessCard href="/admin/clients" icon={Users} title="Clientes" description="Gerenciar cadastro de clientes" color="green" />
      </div>
    </div>
  );
}
const colorClasses: Record<string, string> = {
  blue: "bg-blue-100 text-blue-600",
  amber: "bg-amber-100 text-amber-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
};

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  color: keyof typeof colorClasses;
}

function StatCard({ icon: Icon, title, value, color }: StatCardProps) {
  return (
    <Card className="p-6 flex items-center shadow-md">
      <div className={`rounded-full p-3 mr-4 ${colorClasses[color] || "bg-gray-100 text-gray-600"}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </Card>
  );
}

interface QuickAccessCardProps {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color: keyof typeof colorClasses;
}

function QuickAccessCard({ href, icon: Icon, title, description, color }: QuickAccessCardProps) {
  return (
    <Link href={href}>
      <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
        <div className="flex items-center mb-2">
          <div className={`${colorClasses[color] || "text-gray-600"}`}>
            <Icon className="h-5 w-5 mr-2" />
          </div>
          <h3 className="font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </Card>
    </Link>
  );
}
