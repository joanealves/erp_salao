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
import { Calendar, Search, Filter, Check, X, Clock, AlertCircle } from "lucide-react";
import { toast, Toaster } from 'sonner'
import axios from "axios";
import NewAppointmentModal from "../../components/NewAppointmentModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Appointment = {
  id: number;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: string;
  client_id: number;
  created_at: string;
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);

  const fetchAppointments = async () => {
  try {
    setLoading(true);
    let url = `${API_URL}/appointments?page=${page}&limit=10`;

    if (filter !== "all") {
      url += `&status=${filter}`;
    }

    if (dateFilter) {
      url += `&date=${dateFilter}`;
    }

    if (searchQuery) {
      url += `&search=${encodeURIComponent(searchQuery)}`;
    }

    const response = await axios.get(url);
    
    if (response.data && response.data.items) {
      setAppointments(response.data.items);
      setTotalPages(response.data.total_pages || 1);
    } else {
      setAppointments([]);
      setTotalPages(1);
      console.warn("Formato de resposta inesperado:", response.data);
    }
    
    setLoading(false);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    toast.error("Erro ao carregar agendamentos. Não foi possível buscar os agendamentos. Tente novamente.");
    setAppointments([]);
    setTotalPages(1);
    setLoading(false);
  }
};

  useEffect(() => {
    fetchAppointments();
  }, [page, filter, dateFilter]);

  // Função para buscar quando o usuário parar de digitar
useEffect(() => {
  const timer = setTimeout(() => {
    if (searchQuery) {
      if (page === 1) {
        fetchAppointments();
      } else {
        setPage(1); 
      }
    }
  }, 500);

  return () => clearTimeout(timer);
}, [searchQuery]);

 const updateStatus = async (id: number, newStatus: string) => {
  try {
    await axios.put(`${API_URL}/appointments/${id}`, { status: newStatus });

    // Atualizar localmente
    setAppointments(
      appointments.map((appt) =>
        appt.id === id ? { ...appt, status: newStatus } : appt
      )
    );

    toast.success("Status atualizado. O status do agendamento foi atualizado com sucesso.");
  } catch (error) {
    console.error("Error updating appointment:", error);
    toast.error("Erro ao atualizar. Não foi possível atualizar o status do agendamento.");
  }
};

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

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // Função para lidar com paginação
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (page === 1) {
      fetchAppointments();
    } else {
      setPage(1);
    }
  };

const handleNewAppointmentSuccess = () => {
  setIsNewAppointmentModalOpen(false);
  fetchAppointments();
  toast.success("Agendamento criado. O novo agendamento foi criado com sucesso.");
};

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Agendamentos</h1>
        <Button 
          className="mt-4 md:mt-0"
          onClick={() => setIsNewAppointmentModalOpen(true)}
        >
          Novo Agendamento
        </Button>
      </div>
      
      <Card className="mb-6">
        <form onSubmit={handleSearchSubmit} className="p-4 flex flex-col md:flex-row items-stretch md:items-center space-y-4 md:space-y-0 md:space-x-4">
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
        </form>
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
                  {appointments.length > 0 ? (
                    appointments.map((appointment) => (
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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-gray-500">Nenhum agendamento encontrado.</p>
                          <p className="text-gray-400 text-sm">Tente ajustar os filtros ou adicionar um novo agendamento.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {appointments.length > 0 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(page - 1)} 
                        className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink 
                            onClick={() => handlePageChange(pageNumber)}
                            isActive={page === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    {totalPages > 5 && (
                      <>
                        <PaginationItem>
                          <PaginationLink className="cursor-default">...</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink 
                            onClick={() => handlePageChange(totalPages)}
                            isActive={page === totalPages}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(page + 1)} 
                        className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </Card>
      
      {isNewAppointmentModalOpen && (
        <NewAppointmentModal 
          isOpen={isNewAppointmentModalOpen}
          onClose={() => setIsNewAppointmentModalOpen(false)}
          onSuccess={handleNewAppointmentSuccess}
        />
      )}
    </div>
  );
}