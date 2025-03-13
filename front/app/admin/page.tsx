// Fixed AdminDashboard.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { 
  CalendarDays, 
  Users, 
  DollarSign, 
  Clock, 
  Download, 
  BarChart3, 
  PieChart, 
  Calendar 
} from "lucide-react";
import axios from "axios";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminCalendar from "../components/AdminCalendar";
import AdminLayout  from "../components/layout/AdminLayout";

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
  const [timeframe, setTimeframe] = useState("month");
  const [chartType, setChartType] = useState("line");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/stats?timeframe=${timeframe}`);
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError("Falha ao carregar estatísticas");
        setLoading(false);
      }
    };
    fetchStats();
  }, [timeframe]);

  if (loading) {
    return (
    <AdminLayout> 
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="flex-1 p-4 md:p-6 max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Painel Administrativo</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-4 md:p-6">
                <Skeleton className="h-10 w-10 rounded-full mb-4" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-16" />
              </Card>
            ))}
          </div>
          <Card className="mb-6">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
        </div>
      </AdminLayout>  
    );
  }

  if (error) {
    return (
    <AdminLayout>  
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Painel Administrativo</h1>
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        </div>
    </AdminLayout>    
    );
  }

  // Dados simulados para os gráficos
  const monthlyData = [
    { name: "Jan", Agendamentos: 40, Receita: 4000 },
    { name: "Fev", Agendamentos: 30, Receita: 3200 },
    { name: "Mar", Agendamentos: 20, Receita: 2100 },
    { name: "Abr", Agendamentos: 27, Receita: 2700 },
    { name: "Mai", Agendamentos: 18, Receita: 1900 },
    { name: "Jun", Agendamentos: 23, Receita: 2500 },
  ];

  const weeklyData = [
    { name: "Seg", Agendamentos: 5, Receita: 500 },
    { name: "Ter", Agendamentos: 7, Receita: 700 },
    { name: "Qua", Agendamentos: 6, Receita: 650 },
    { name: "Qui", Agendamentos: 4, Receita: 450 },
    { name: "Sex", Agendamentos: 8, Receita: 900 },
    { name: "Sáb", Agendamentos: 10, Receita: 1200 },
    { name: "Dom", Agendamentos: 2, Receita: 200 },
  ];

  const dailyData = [
    { name: "08:00", Agendamentos: 1, Receita: 100 },
    { name: "10:00", Agendamentos: 2, Receita: 250 },
    { name: "12:00", Agendamentos: 1, Receita: 150 },
    { name: "14:00", Agendamentos: 3, Receita: 350 },
    { name: "16:00", Agendamentos: 2, Receita: 200 },
    { name: "18:00", Agendamentos: 1, Receita: 120 },
  ];

const chartData = 
  timeframe === "month" ? monthlyData : 
  timeframe === "week" ? weeklyData : 
        dailyData;
  
  const serviceData = [
    { name: "Corte Masculino", value: 40 },
    { name: "Corte Feminino", value: 30 },
    { name: "Barba", value: 20 },
    { name: "Manicure", value: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Período,Agendamentos,Receita\n"
      + chartData.map(row => `${row.name},${row.Agendamentos},${row.Receita}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
      
  return (
    <AdminLayout>  
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Painel Administrativo</h1>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Hoje</SelectItem>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="month">Mês</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" aria-label="Opção para exportar arquivos em CSV" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Exportar</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={CalendarDays} title="Agendamentos Hoje" value={stats.todayAppointments} color="blue" />
        <StatCard icon={Clock} title="Pendentes" value={stats.pendingAppointments} color="amber" />
        <StatCard icon={Users} title="Total de Clientes" value={stats.totalClients} color="green" />
        <StatCard icon={DollarSign} title="Faturamento" value={`R$ ${stats.revenue}`} color="purple" />
      </div>

      <Tabs defaultValue="charts" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="charts">Gráficos</TabsTrigger>
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Desempenho</CardTitle>
                  <CardDescription>
                    Visão geral de agendamentos e receita
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant={chartType === "line" ? "default" : "outline"} 
                    size="sm"
                    aria-label="Botão para selecionar os tipos de graficos se de linha "
                    onClick={() => setChartType("line")}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={chartType === "bar" ? "default" : "outline"} 
                    size="sm"
                    aria-label="Botão para selecionar os tipos de graficos, neste caso de barras"
                    onClick={() => setChartType("bar")}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "line" ? (
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="Agendamentos" stroke="#8884d8" />
                        <Line yAxisId="right" type="monotone" dataKey="Receita" stroke="#82ca9d" />
                      </LineChart>
                    ) : (
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Agendamentos" fill="#8884d8" />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Serviços Mais Procurados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={serviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {serviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendário de Agendamentos</CardTitle>
              <CardDescription>Visão completa dos agendamentos do período</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminCalendar initialAppointments={[]} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <QuickAccessCard 
            href="/admin/appointments" 
            icon={CalendarDays} 
            title="Agendamentos" 
            description="Gerenciar agendamentos e horários" 
            color="blue" 
          />
          <QuickAccessCard 
            href="/admin/clients" 
            icon={Users} 
            title="Clientes" 
            description="Gerenciar cadastro de clientes" 
            color="green" 
          />
          <QuickAccessCard 
            href="/admin/reports" 
            icon={BarChart3} 
            title="Relatórios" 
            description="Análise detalhada do negócio" 
            color="purple" 
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Próximos Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Cliente</th>
                  <th className="text-left py-3 px-2 hidden md:table-cell">Serviço</th>
                  <th className="text-left py-3 px-2">Horário</th>
                  <th className="text-left py-3 px-2 hidden sm:table-cell">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 1, name: "João Silva", service: "Corte Masculino", time: "14:00", status: "confirmed" },
                  { id: 2, name: "Maria Oliveira", service: "Corte Feminino", time: "15:30", status: "pending" },
                  { id: 3, name: "Pedro Santos", service: "Barba", time: "16:45", status: "confirmed" },
                ].map((appointment) => (
                  <tr key={appointment.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2">{appointment.name}</td>
                    <td className="py-3 px-2 hidden md:table-cell">{appointment.service}</td>
                    <td className="py-3 px-2">{appointment.time}</td>
                    <td className="py-3 px-2 hidden sm:table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        appointment.status === "confirmed" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {appointment.status === "confirmed" ? "Confirmado" : "Pendente"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-center">
              <Button asChild variant="outline" size="sm" aria-label="Botão de visualizar todos os agendamentos> redirecionamento de tab">
              <Link href="/admin/appointments">Ver Todos</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </AdminLayout>  
  );
}

const colorClasses: Record<string, string> = {
  primary: "bg-blue-100 text-blue-600",
  secondary: "bg-gray-100 text-gray-600",
  success: "bg-green-100 text-green-600",
  danger: "bg-red-100 text-red-600",
};

type StatCardProps = {
  icon: LucideIcon;
  title: string;
  value: string | number;
  color: keyof typeof colorClasses;
};


function StatCard({ icon: Icon, title, value, color }: StatCardProps) {
  return (
    <Card className="p-4 flex items-center shadow-sm">
      <div className={`rounded-full p-3 mr-3 ${colorClasses[color] || "bg-gray-100 text-gray-600"}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="overflow-hidden">
        <p className="text-xs text-gray-500 truncate">{title}</p>
        <p className="text-lg md:text-xl font-bold truncate">{value}</p>
      </div>
    </Card>
  );
}

type QuickAccessCardProps = {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  color: keyof typeof colorClasses;
};


function QuickAccessCard({ href, icon: Icon, title, description, color }: QuickAccessCardProps) {
  return (
    <Link href={href}>
      <Card className="p-4 hover:shadow-lg transition-all cursor-pointer h-full">
        <div className="flex items-center mb-2">
          <div className={`rounded-full p-2 mr-2 ${colorClasses[color] || "bg-gray-100 text-gray-600"}`}>
            <Icon className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
        <p className="text-xs text-gray-500">{description}</p>
      </Card>
    </Link>
  );
}