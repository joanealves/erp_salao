"use client";

import { useState, useEffect } from "react";
import axios from "axios";


import NewAppointmentModal from "../../components/NewAppointmentModal";
import AdminCalendar from "../../components/AdminCalendar";
import AdminLayout from "../../components/layout/AdminLayout";

import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, Check, X, RefreshCw, MoreVertical } from "lucide-react";
import { toast, Toaster } from "sonner";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";


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
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState("table");
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Erro ao carregar agendamentos. Não foi possível buscar os agendamentos. Tente novamente.");
      setAppointments([]);
      setTotalPages(1);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [page, filter, dateFilter]);

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
      setAppointments(
        appointments.map((appt) =>
          appt.id === id ? { ...appt, status: newStatus } : appt
        )
      );
      if (selectedAppointment && selectedAppointment.id === id) {
        setSelectedAppointment({ ...selectedAppointment, status: newStatus });
      }
      toast.success("Status atualizado. O status do agendamento foi atualizado com sucesso.");
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Erro ao atualizar. Não foi possível atualizar o status do agendamento.");
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  const exportToCSV = () => {
    const headers = ["Nome", "Telefone", "Serviço", "Data", "Horário", "Status"];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      appointments.map((appt) => {
        const status = appt.status as Status; // Forçar o tipo aqui
        return `"${appt.name}","${appt.phone}","${appt.service}","${formatDate(appt.date)}","${appt.time}","${getStatusText(status)}"`;
      }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "agendamentos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  type Status = "pending" | "confirmed" | "completed" | "canceled";

  const getStatusBadge = (status: Status) => {
    const badges = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: <Clock size={14} />, text: "Pendente" },
      confirmed: { color: "bg-blue-100 text-blue-800", icon: <Check size={14} />, text: "Confirmado" },
      completed: { color: "bg-green-100 text-green-800", icon: <Check size={14} />, text: "Concluído" },
      canceled: { color: "bg-red-100 text-red-800", icon: <X size={14} />, text: "Cancelado" },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${badge.color}`}>
        {badge.icon}
        <span>{badge.text}</span>
      </span>
    );
  };

  const getStatusText = (status: Status): string => {
    const statusMap: Record<Status, string> = {
      pending: "Pendente",
      confirmed: "Confirmado",
      completed: "Concluído",
      canceled: "Cancelado",
    };
    return statusMap[status] || "Pendente";
  };

  const getStatusBadge2 = (status: Status) => {
    const variants: Record<Status, BadgeProps["variant"]> = {
      pending: "outline",
      confirmed: "default",
      completed: "secondary",
      canceled: "destructive",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {getStatusText(status)}
      </Badge>
    );
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

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

  const openAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsOpen(true);
  };

  const handleSendSMS = (phone: string) => {
    toast.success(`SMS enviado para ${phone}`);
  };

  return (
    <AdminLayout>
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Gerenciar Agendamentos</h1>
          <p className="text-gray-500 mt-1">Visualize e gerencie todos os agendamentos</p>
        </div>
        <div className="flex mt-4 md:mt-0 space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2"
          >
            {refreshing ? (
              <>
                <RefreshCw className="animate-spin" size={16} />
                <span>Atualizando...</span>
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                <span>Atualizar</span>
              </>
            )}
          </Button>
          <Button
            onClick={() => setIsNewAppointmentModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <Clock size={16} />
            <span>Novo Agendamento</span>
          </Button>
        </div>
      </div>

      {/* Filtros e Pesquisa */}
      <Card className="mb-6">
        <div className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex space-x-2 w-full md:w-auto">
            <Select value={filter} onValueChange={(value) => setFilter(value)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="canceled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="Filtrar por data"
              className="w-full md:w-[180px]"
            />
          </div>
          <form onSubmit={handleSearchSubmit} className="flex space-x-2 w-full md:w-auto">
            <Input
              type="text"
              placeholder="Pesquisar por nome ou serviço..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-[250px]"
            />
            <Button type="submit" variant="secondary">
              <Clock size={16} />
            </Button>
          </form>
        </div>
      </Card>

      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value)}>
        <div className="flex justify-end mb-4">
          <TabsList>
            <TabsTrigger value="table">Tabela</TabsTrigger>
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
          </TabsList>
        </div>

        {/* Conteúdo Principal - Agora dentro do componente Tabs */}
        <TabsContent value="table">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : appointments.length > 0 ? (
                  appointments.map((appt) => (
                    <TableRow key={appt.id}>
                      <TableCell>{appt.name}</TableCell>
                      <TableCell>{appt.phone}</TableCell>
                      <TableCell>{appt.service}</TableCell>
                      <TableCell>{formatDate(appt.date)} às {appt.time}</TableCell>
                      <TableCell>{getStatusBadge2(appt.status as Status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => openAppointmentDetails(appt)}>
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendSMS(appt.phone)}>
                              Enviar SMS
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => updateStatus(appt.id, "confirmed")}>
                              Confirmar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(appt.id, "canceled")}>
                              Cancelar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Nenhum agendamento encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
          {/* Paginação */}
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(page + 1)}
                  className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </TabsContent>

        <TabsContent value="calendar">
          <AdminCalendar initialAppointments={appointments} />
        </TabsContent>
      </Tabs>

      {/* Modal de Novo Agendamento */}
      <NewAppointmentModal
        isOpen={isNewAppointmentModalOpen}
        onClose={() => setIsNewAppointmentModalOpen(false)}
        onSuccess={handleNewAppointmentSuccess}
      />

      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Detalhes do Agendamento</SheetTitle>
            <SheetDescription>
              Informações completas sobre o agendamento selecionado.
            </SheetDescription>
          </SheetHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <p><strong>Nome:</strong> {selectedAppointment.name}</p>
              <p><strong>Telefone:</strong> {selectedAppointment.phone}</p>
              <p><strong>Serviço:</strong> {selectedAppointment.service}</p>
              <p><strong>Data:</strong> {formatDate(selectedAppointment.date)} às {selectedAppointment.time}</p>
              <p><strong>Status:</strong> {getStatusBadge2(selectedAppointment.status as Status)}</p>
            </div>
          )}
          <SheetFooter className="mt-6">
            <SheetClose asChild>
              <Button variant="outline">Fechar</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Toaster position="bottom-right" />
      </div>
    </AdminLayout>
  );
} 
