// app/admin/appointments/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Search, Filter, Check, X, Clock } from "lucide-react";

type Appointment = {
  id: number;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: string;
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // In a real app, fetch from your API
    const fetchAppointments = async () => {
      try {
        // const response = await fetch('http://localhost:8000/appointments');
        // const data = await response.json();
        
        // Mock data for now
        setAppointments([
          {
            id: 1,
            name: "Maria Silva",
            phone: "(11) 98765-4321",
            service: "Corte de Cabelo",
            date: "2025-02-25",
            time: "14:30",
            status: "pending"
          },
          {
            id: 2,
            name: "João Pereira",
            phone: "(11) 91234-5678",
            service: "Coloração",
            date: "2025-02-25",
            time: "16:00",
            status: "confirmed"
          },
          {
            id: 3,
            name: "Ana Souza",
            phone: "(11) 99876-5432",
            service: "Hidratação",
            date: "2025-02-26",
            time: "10:00",
            status: "pending"
          },
          {
            id: 4,
            name: "Carlos Ferreira",
            phone: "(11) 97654-3210",
            service: "Corte de Cabelo",
            date: "2025-02-26",
            time: "11:30",
            status: "completed"
          },
          {
            id: 5,
            name: "Lucia Santos",
            phone: "(11) 95555-1234",
            service: "Coloração",
            date: "2025-02-27",
            time: "09:00",
            status: "canceled"
          }
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Update appointment status
  const updateStatus = async (id: number, newStatus: string) => {
    // In a real app, you'd make an API call
    // await fetch(`http://localhost:8000/appointments/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status: newStatus })
    // });
    
    // For now, update locally
    setAppointments(appointments.map(appt => 
      appt.id === id ? { ...appt, status: newStatus } : appt
    ));
  };

  // Filter appointments based on selections
  const filteredAppointments = appointments.filter(appt => {
    const matchesStatus = filter === "all" || appt.status === filter;
    const matchesDate = !dateFilter || appt.date === dateFilter;
    const matchesSearch = !searchQuery || 
      appt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.phone.includes(searchQuery);
    
    return matchesStatus && matchesDate && matchesSearch;
  });

  // Get status badge
  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string, icon: any, text: string }> = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: <Clock size={14} />, text: "Pendente" },
      confirmed: { color: "bg-blue-100 text-blue-800", icon: <Check size={14} />, text: "Confirmado" },
      completed: { color: "bg-green-100 text-green-800", icon: <Check size={14} />, text: "Concluído" },
      canceled: { color: "bg-red-100 text-red-800", icon: <X size={14} />, text: "Cancelado" }
    };
    
    const badge = badges[status] || badges.pending;
    
    return (
      <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${badge.color}`}>
        {badge.icon}
        <span>{badge.text}</span>
      </span>
    );
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Agendamentos</h1>
        <Button className="mt-4 md:mt-0">Novo Agendamento</Button>
      </div>
      
      <Card className="mb-6">
        <div className="p-4 flex flex-col md:flex-row items-stretch md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center flex-1">
            <Search className="h-4 w-4 mr-2 text-gray-500" />
            <Input 
              placeholder="Buscar por nome ou telefone" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="confirmed">Confirmados</SelectItem>
                  <SelectItem value="completed">Concluídos</SelectItem>
                  <SelectItem value="canceled">Cancelados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Input 
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-40"
              />
            </div>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="p-4">
          {loading ? (
            <p className="text-center py-4">Carregando agendamentos...</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{appointment.name}</p>
                          <p className="text-sm text-gray-500">{appointment.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.service}</TableCell>
                      <TableCell>{formatDate(appointment.date)}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {appointment.status === "pending" && (
                            <Button 
                              size="sm" 
                              onClick={() => updateStatus(appointment.id, "confirmed")}
                              variant="outline"
                              className="text-xs h-8"
                            >
                              Confirmar
                            </Button>
                          )}
                          {(appointment.status === "pending" || appointment.status === "confirmed") && (
                            <Button 
                              size="sm" 
                              onClick={() => updateStatus(appointment.id, "canceled")}
                              variant="outline"
                              className="text-xs h-8 text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Cancelar
                            </Button>
                          )}
                          {appointment.status === "confirmed" && (
                            <Button 
                              size="sm" 
                              onClick={() => updateStatus(appointment.id, "completed")}
                              variant="outline"
                              className="text-xs h-8 text-green-600 border-green-200 hover:bg-green-50"
                            >
                              Concluir
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredAppointments.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-gray-500">Nenhum agendamento encontrado.</p>
                </div>
              )}
              
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}