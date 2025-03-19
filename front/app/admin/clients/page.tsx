"use client";

import { useState, useEffect } from "react";
import axios from "axios";

import AdminLayout from "../../components/layout/AdminLayout";

import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, RefreshCw, Search, MoreVertical, UserPlus } from "lucide-react";
import { toast, Toaster } from "sonner";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
            const response = await axios.post(`${API_URL}/clients`, newClient);

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
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">Clientes</h1>
                        <p className="text-gray-500 mt-1">Gerenciar cadastro de clientes</p>
                    </div>
                    <div className="flex mt-4 md:mt-0 space-x-2">
                        <Button
                            onClick={() => setIsNewClientModalOpen(true)}
                            className="flex items-center space-x-2"
                        >
                            <UserPlus size={16} />
                            <span>Novo Cliente</span>
                        </Button>
                    </div>
                </div>

                <Card className="mb-6">
                    <div className="p-4 md:p-6">
                        <form onSubmit={handleSearch} className="flex space-x-2">
                            <Input
                                type="text"
                                placeholder="Pesquisar por nome, telefone ou email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full md:w-[350px]"
                            />
                            <Button type="submit" variant="secondary">
                                <Search size={16} />
                            </Button>
                        </form>
                    </div>
                </Card>

                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Telefone</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Última Visita</TableHead>
                                <TableHead>Total Visitas</TableHead>
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
                            ) : clients.length > 0 ? (
                                clients.map((client) => (
                                    <TableRow key={client.id}>
                                        <TableCell>{client.name}</TableCell>
                                        <TableCell>{client.phone}</TableCell>
                                        <TableCell>{client.email || "-"}</TableCell>
                                        <TableCell>{formatDate(client.last_visit)}</TableCell>
                                        <TableCell>{client.total_visits}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem>
                                                        Ver Detalhes
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        Novo Agendamento
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600">
                                                        Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">
                                        Nenhum cliente encontrado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <Pagination className="py-4">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => page > 1 && setPage(page - 1)}
                                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink isActive>{page}</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => page < totalPages && setPage(page + 1)}
                                    className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </Card>

                <Dialog open={isNewClientModalOpen} onOpenChange={setIsNewClientModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Novo Cliente</DialogTitle>
                            <DialogDescription>
                                Preencha os dados para cadastrar um novo cliente.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Nome
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={newClient.name}
                                    onChange={handleInputChange}
                                    placeholder="Nome completo"
                                    className={formErrors.name ? "border-red-500" : ""}
                                />
                                {formErrors.name && (
                                    <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium">
                                    Telefone
                                </label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={newClient.phone}
                                    onChange={handleInputChange}
                                    placeholder="(00) 00000-0000"
                                    className={formErrors.phone ? "border-red-500" : ""}
                                />
                                {formErrors.phone && (
                                    <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email (opcional)
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={newClient.email}
                                    onChange={handleInputChange}
                                    placeholder="email@exemplo.com"
                                    className={formErrors.email ? "border-red-500" : ""}
                                />
                                {formErrors.email && (
                                    <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsNewClientModalOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleCreateClient} disabled={loading}>
                                {loading ? "Salvando..." : "Salvar"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Toaster position="bottom-right" />
            </div>
        </AdminLayout>
    );
}