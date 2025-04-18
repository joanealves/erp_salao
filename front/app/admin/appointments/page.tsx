"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Toaster } from "sonner";

import AdminLayout from "../../components/layout/AdminLayout";
import AdminCalendar from "../../components/AdminCalendar";
import NewAppointmentModal from "../../components/NewAppointmentModal";
import AppointmentsHeader from "../../components/appoiments/AppointmentsHeader";
import AppointmentsFilter from "../../components/appoiments/AppointmentsFilter";
import AppointmentsTable from "../../components/appoiments/AppointmentsTable";
import AppointmentDetails from "../../components/appoiments/AppointmentDetails";

import { Appointment } from "../../types/appointment";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
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
  };

  const openAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsOpen(true);
  };

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
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <AppointmentsHeader
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onNewAppointment={() => setIsNewAppointmentModalOpen(true)}
        />

        <AppointmentsFilter
          filter={filter}
          setFilter={setFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
        />

        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value)} className="w-full">
            <div className="border-b px-6 py-3 flex justify-between items-center">
              <h2 className="text-lg font-medium">Visualização</h2>
              <TabsList className="bg-slate-100 dark:bg-slate-800">
                <TabsTrigger value="table" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                  Tabela
                </TabsTrigger>
                <TabsTrigger value="calendar" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                  Calendário
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="table" className="pt-0 m-0">
              <CardContent className="p-0">
                <AppointmentsTable
                  appointments={appointments}
                  loading={loading}
                  onViewDetails={openAppointmentDetails}
                  onUpdateStatus={updateStatus}
                  onRefresh={handleRefresh}
                />
              </CardContent>

              <div className="border-t p-4 bg-slate-50 dark:bg-gray-800/50">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(page - 1)}
                        className={page === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNumber)}
                            isActive={pageNumber === page}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(page + 1)}
                        className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="m-0 p-6">
              <AdminCalendar initialAppointments={appointments} />
            </TabsContent>
          </Tabs>
        </div>

        <NewAppointmentModal
          isOpen={isNewAppointmentModalOpen}
          onClose={() => setIsNewAppointmentModalOpen(false)}
          onSuccess={handleNewAppointmentSuccess}
        />

        <AppointmentDetails
          appointment={selectedAppointment}
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />

        <Toaster position="bottom-right" />
      </div>
    </AdminLayout>
  );
}