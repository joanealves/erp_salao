"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Appointment = {
  id: number;
  name: string;
  service: string;
  date: string;
  time: string;
  status: string;
};

export default function AdminCalendar({ initialAppointments }: { initialAppointments: Appointment[] }) {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "month">("month");
  const [localAppointments, setLocalAppointments] = useState<Appointment[]>(initialAppointments);
  const [loading, setLoading] = useState(false);

  // Buscar agendamentos para a data selecionada
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const formattedDate = date.toISOString().split("T")[0];
      const response = await axios.get(`${API_URL}/appointments?date=${formattedDate}`);
      if (response.data && response.data.items) {
        setLocalAppointments(response.data.items);
      } else {
        setLocalAppointments([]);
      }
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      setLocalAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [date]);

  // Formatar a data
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Navegar entre os dias
  const navigateDay = (direction: "prev" | "next") => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + (direction === "prev" ? -1 : 1));
    setDate(newDate);
  };

  // Definir cor do status
  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 border-yellow-300",
      confirmed: "bg-blue-100 border-blue-300",
      completed: "bg-green-100 border-green-300",
      canceled: "bg-red-100 border-red-300",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 border-gray-300";
  };

  return (
    <div>
      <Tabs value={view} onValueChange={(v) => setView(v as "day" | "month")} className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <TabsList className="mb-4 sm:mb-0">
            <TabsTrigger value="month">Mês</TabsTrigger>
            <TabsTrigger value="day">Dia</TabsTrigger>
          </TabsList>
          {view === "day" && (
            <div className="flex items-center space-x-2">
              <button onClick={() => navigateDay("prev")} className="p-1 rounded-full hover:bg-gray-100">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm font-medium">{formatDate(date)}</span>
              <button onClick={() => navigateDay("next")} className="p-1 rounded-full hover:bg-gray-100">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Renderizar o conteúdo correto apenas se a aba estiver ativa */}
        {view === "month" && (
          <TabsContent value="month" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
              <div className="col-span-1 lg:col-span-3">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  className="border rounded-md p-3"
                />
              </div>
              <div className="col-span-1 lg:col-span-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium mb-3">
                      Agendamentos para {date.toLocaleDateString("pt-BR")}
                    </h3>
                    {loading ? (
                      <p className="text-center py-4">Carregando...</p>
                    ) : localAppointments.length === 0 ? (
                      <p className="text-center py-4 text-gray-500">Nenhum agendamento para esta data.</p>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {localAppointments.map((appointment) => (
                          <div key={appointment.id} className={`p-3 border rounded-md ${getStatusColor(appointment.status)}`}>
                            <div className="flex justify-between">
                              <p className="font-medium">{appointment.name}</p>
                              <p className="text-sm">{appointment.time}</p>
                            </div>
                            <p className="text-sm text-gray-600">{appointment.service}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        )}

        {view === "day" && (
          <TabsContent value="day" className="mt-0">
            <Card>
              <CardContent className="p-4">
                {loading ? (
                  <p className="text-center py-4">Carregando...</p>
                ) : localAppointments.length === 0 ? (
                  <p className="text-center py-4 text-gray-500">Nenhum agendamento para esta data.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {localAppointments.map((appointment) => (
                      <div key={appointment.id} className={`p-3 border rounded-md ${getStatusColor(appointment.status)}`}>
                        <div className="flex justify-between">
                          <p className="font-medium">{appointment.name}</p>
                          <p className="text-sm">{appointment.time}</p>
                        </div>
                        <p className="text-sm text-gray-600">{appointment.service}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
