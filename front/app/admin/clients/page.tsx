"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../components/layout/AdminLayout";
import { toast, Toaster } from "sonner";

import { ClientsHeader, ClientsSearch, ClientsTable, NewClientModal } from "../../components/clients";

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
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
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

    const fetchClients = async () => {
        try {
            setLoading(true);
            let url = `${API_URL}/clients?page=${page}&limit=10`;
            if (searchQuery) {
                url += `&search=${encodeURIComponent(searchQuery)}`;
            }
            const response = await axios.get(url);
            if (response.data && response.data.items) {
                setClients(response.data.items);
                setTotalPages(response.data.total_pages || 1);
            } else {
                setClients([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error("Error fetching clients:", error);
            toast.error("Erro ao carregar clientes");
            setClients([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, [page]);

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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchClients();
    };

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

        if (newClient.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(newClient.email)) {
            errors.email = "Email inválido";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewClient(prev => ({ ...prev, [name]: value }));

        if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleCreateClient = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            const clientData = {
                name: newClient.name.trim(),
                phone: newClient.phone.trim(),
                email: newClient.email.trim() || null 
            };

            const response = await axios.post(`${API_URL}/clients`, clientData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            toast.success("Cliente criado com sucesso");
            setIsNewClientModalOpen(false);
            setNewClient({ name: "", phone: "", email: "" });
            setFormErrors({ name: "", phone: "", email: "" });
            fetchClients();
        } catch (error: any) {
            console.error("Error creating client:", error);

            if (error.response) {
                const status = error.response.status;

                if (status === 422 && error.response.data.detail) {
                    const apiErrors = error.response.data.detail;

                    const newErrors = { name: "", phone: "", email: "" };
                    if (Array.isArray(apiErrors)) {
                        apiErrors.forEach((err: any) => {
                            if (err.loc && err.loc.length > 1) {
                                const field = err.loc[1];
                                if (field in newErrors) {
                                    newErrors[field as keyof typeof newErrors] = err.msg;
                                }
                            }
                        });
                    }

                    setFormErrors(newErrors);
                    toast.error("Verifique os dados do formulário");
                } else if (status === 500) {
                    toast.error("Erro no servidor. Tente novamente mais tarde.");
                } else {
                    toast.error(`Erro ao criar cliente: ${error.response.data?.detail || "Erro desconhecido"}`);
                }
            } else if (error.request) {
                toast.error("Servidor indisponível. Verifique sua conexão.");
            } else {
                toast.error("Erro ao enviar requisição.");
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "Nunca";
        try {
            if (dateStr.includes('T')) {
                const date = new Date(dateStr);
                return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            }
            const [year, month, day] = dateStr.split('-');
            return `${day}/${month}/${year}`;
        } catch (error) {
            console.error("Error formatting date:", error);
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

                <Toaster position="bottom-right" />
            </div>
        </AdminLayout>
    );
}