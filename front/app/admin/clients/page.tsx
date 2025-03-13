"use client";

import { useState, useEffect } from "react";
import axios from "axios";

import AdminLayout  from "../../components/layout/AdminLayout";

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewClient(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateClient = async () => {
        try {
            await axios.post(`${API_URL}/clients`, newClient);
            toast.success("Cliente criado com sucesso");
            setIsNewClientModalOpen(false);
            setNewClient({ name: "", phone: "", email: "" });
            fetchClients();
        } catch (error) {
            console.error("Error creating client:", error);
            toast.error("Erro ao criar cliente");
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "Nunca";
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
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

            {/* Filtros e Pesquisa */}
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

            {/* Tabela de Clientes */}
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

                {/* Paginação */}
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

            {/* Modal de Novo Cliente */}
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
                            />
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
                            />
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
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsNewClientModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleCreateClient}>
                            Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Toaster position="bottom-right" />
        </div>
        </AdminLayout>  
    );
}