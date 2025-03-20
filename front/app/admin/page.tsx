"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "../components/layout/AdminLayout";
import DashboardHeader from "../../app/components/dashboard/DashboardHeader";
import StatCards from "../../app/components/dashboard/StatCards";
import DashboardCharts from "../../app/components/dashboard/DashboardCharts";
import DashboardCalendar from "../../app/components/dashboard/DashboardCalendar";
import QuickAccess from "../../app/components/dashboard/QuickAccess";
import AppointmentTable from "../../app/components/dashboard/AppointmentTable";

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
  const chartData = getChartData(timeframe);
  const serviceData = [
    { name: "Corte Masculino", value: 40 },
    { name: "Corte Feminino", value: 30 },
    { name: "Barba", value: 20 },
    { name: "Manicure", value: 10 },
  ];

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
        <DashboardHeader
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          exportToCSV={exportToCSV}
        />

        <StatCards stats={stats} />

        <Tabs defaultValue="charts" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="charts">Gráficos</TabsTrigger>
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
          </TabsList>

          <TabsContent value="charts">
            <DashboardCharts
              chartData={chartData}
              serviceData={serviceData}
              chartType={chartType}
              setChartType={setChartType}
            />
          </TabsContent>

          <TabsContent value="calendar">
            <DashboardCalendar />
          </TabsContent>
        </Tabs>

        <QuickAccess />

        <AppointmentTable />
      </div>
    </AdminLayout>
  );
}

function getChartData(timeframe: string) {
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

  return timeframe === "month" ? monthlyData :
    timeframe === "week" ? weeklyData :
      dailyData;
}