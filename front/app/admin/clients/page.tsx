"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../components/layout/AdminLayout";
import { toast, Toaster } from "sonner";

import {
    ClientsHeader,
    ClientsSearch,
    ClientsTable,
    NewClientModal
} from "../../components/clients";
import DetailsClientModal from "../../components/clients/DetailsClientModal";
import EditClientModal from "../../components/clients/EditClientModal";
import NewAppointmentModal from "../../components/NewAppointmentModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Client = {
    id: number;
    name: string;
    phone: string;
    email: string;
    last_visit: string;
    total_visits: number;
    created_at: string;
};

export default function ClientsPage() {
    // Estados principais
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Estados para modais
    const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    // Estado para novo cliente
    const [newClient, setNewClient] = useState({
        name: "",
        phone: "",
        email: "",
    });
    const [formErrors, setFormErrors] = useState({
        name: "",
        phone: "",
        email: ""
    });

    // Buscar clientes
    const fetchClients = async () => {
        try {
            setLoading(true);
            let url = `${API_URL}/clients?page=${page}&limit=10`;
            if (searchQuery) {
                url += `&search=${encodeURIComponent(searchQuery)}`;
            }

            const response = await axios.get(url);
            const { items, total_pages } = response.data;

            setClients(items || []);
            setTotalPages(total_pages || 1);
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
            toast.error("Não foi possível carregar os clientes");
            setClients([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    // Efeitos
    useEffect(() => {
        fetchClients();
    }, [page]);

    // Debounce para busca
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery) {
                if (page === 1) {
                    fetchClients();
                } else {
                    setPage(1);
                }
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Validação de formulário
    const validateForm = () => {
        let isValid = true;
        const errors = {
            name: "",
            phone: "",
            email: ""
        };

        if (!newClient.name || newClient.name.length < 3) {
            errors.name = "Nome deve ter pelo menos 3 caracteres";
            isValid = false;
        }

        if (!newClient.phone || newClient.phone.length < 8) {
            errors.phone = "Telefone deve ter pelo menos 8 caracteres";
            isValid = false;
        }

        if (newClient.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newClient.email)) {
            errors.email = "Email inválido";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    // Handlers de ações
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewClient(prev => ({ ...prev, [name]: value }));

        if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleCreateClient = async () => {
        if (!validateForm()) return;

        try {
            const clientData = {
                name: newClient.name.trim(),
                phone: newClient.phone.trim(),
                email: newClient.email ? newClient.email.trim() : null
            };

            await axios.post(`${API_URL}/clients`, clientData);

            toast.success("Cliente criado com sucesso");
            setIsNewClientModalOpen(false);
            setNewClient({ name: "", phone: "", email: "" });
            fetchClients();
        } catch (error: any) {
            if (error.response?.status === 422) {
                const apiErrors = error.response.data;
                const newErrors = { name: "", phone: "", email: "" };

                apiErrors.forEach((err: any) => {
                    const field = err.loc[1];
                    if (field in newErrors) {
                        newErrors[field as keyof typeof newErrors] = err.msg;
                    }
                });

                setFormErrors(newErrors);
                toast.error("Verifique os dados do formulário");
            } else {
                toast.error("Erro ao criar cliente");
            }
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchClients();
    };

    // Funções para ações da tabela
    const handleViewDetails = (client: Client) => {
        setSelectedClient(client);
        setIsDetailsModalOpen(true);
    };

    const handleEditClient = (client: Client) => {
        setSelectedClient(client);
        setIsEditModalOpen(true);
    };

    const handleDeleteClient = async (clientId: number) => {
        try {
            const confirmDelete = window.confirm("Tem certeza que deseja excluir este cliente?");
            if (!confirmDelete) return;

            setLoading(true);
            await axios.delete(`${API_URL}/clients/${clientId}`);

            toast.success("Cliente excluído com sucesso");
            fetchClients();
        } catch (error) {
            console.error("Erro ao excluir cliente:", error);
            toast.error("Não foi possível excluir o cliente");
        } finally {
            setLoading(false);
        }
    };

    const handleNewSchedule = (client: Client) => {
        setSelectedClient(client);
        setIsNewAppointmentModalOpen(true);
    };

    // Utilitário para formatar data
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "Nunca";
        try {
            const date = new Date(dateStr);
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        } catch (error) {
            console.error("Erro ao formatar data:", error);
            return "Data inválida";
        }
    };

    return (
        <AdminLayout>
            <div className="p-4 md:p-6 max-w-7xl mx-auto">
                <ClientsHeader onNewClient={() => setIsNewClientModalOpen(true)} />

                <ClientsSearch
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSubmit={handleSearch}
                />

                <ClientsTable
                    clients={clients}
                    loading={loading}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    formatDate={formatDate}
                    onViewDetails={handleViewDetails}
                    onEditClient={handleEditClient}
                    onDeleteClient={handleDeleteClient}
                    onNewSchedule={handleNewSchedule}
                />

                <NewClientModal
                    isOpen={isNewClientModalOpen}
                    onOpenChange={setIsNewClientModalOpen}
                    newClient={newClient}
                    formErrors={formErrors}
                    loading={loading}
                    onInputChange={handleInputChange}
                    onCreateClient={handleCreateClient}
                />

                {selectedClient && (
                    <>
                        <DetailsClientModal
                            isOpen={isDetailsModalOpen}
                            onOpenChange={setIsDetailsModalOpen}
                            client={selectedClient}
                            formatDate={formatDate}
                        />

                        <EditClientModal
                            isOpen={isEditModalOpen}
                            onOpenChange={setIsEditModalOpen}
                            client={{
                                id: selectedClient.id,
                                name: selectedClient.name,
                                phone: selectedClient.phone,
                                email: selectedClient.email
                            }}
                        />

                        <NewAppointmentModal
                            isOpen={isNewAppointmentModalOpen}
                            onClose={() => setIsNewAppointmentModalOpen(false)}
                            onSuccess={() => {
                                fetchClients();
                            }}
                        />
                    </>
                )}

                <Toaster position="bottom-right" />
            </div>
        </AdminLayout>
    );
}