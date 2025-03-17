"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Search, RefreshCw, Users, Plus, MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from "@/components/ui/sheet";
import AdminLayout from "../../components/layout/AdminLayout";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Client = {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    created_at: string;
    last_visit: string | null;
    total_visits: number;
};

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isNewClientOpen, setIsNewClientOpen] = useState(false);
    const [formData, setFormData] = useState({
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
                console.warn("Formato de resposta inesperado:", response.data);
            }
            setLoading(false);
            setRefreshing(false);
        } catch (error) {
            console.error("Error fetching clients:", error);
            toast.error("Erro ao carregar clientes. Tente novamente.");
            setClients([]);
            setTotalPages(1);
            setLoading(false);
            setRefreshing(false);
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

    const handleRefresh = () => {
        setRefreshing(true);
        fetchClients();
    };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (page === 1) {
            fetchClients();
        } else {
            setPage(1);
        }
    };

    const openClientDetails = (client: Client) => {
        setSelectedClient(client);
        setIsDetailsOpen(true);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/clients`, formData);
            setIsNewClientOpen(false);
            setFormData({ name: "", phone: "", email: "" });
            fetchClients();
            toast.success("Cliente cadastrado com sucesso!");
        } catch (error) {
            console.error("Error creating client:", error);
            toast.error("Erro ao cadastrar cliente. Tente novamente.");
        }
    };

    return (
        <AdminLayout>
            <div className="p-4 md:p-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">Gerenciar Clientes</h1>
                        <p className="text-gray-500 mt-1">Cadastre e gerencie seus clientes</p>
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
                            onClick={() => setIsNewClientOpen(true)}
                            className="flex items-center space-x-2"
                        >
                            <Plus size={16} />
                            <span>Novo Cliente</span>
                        </Button>
                    </div>
                </div>

                {/* Pesquisa */}
                <Card className="mb-6">
                    <div className="p-4 md:p-6">
                        <form onSubmit={handleSearchSubmit} className="flex space-x-2">
                            <Input
                                type="text"
                                placeholder="Pesquisar por nome, telefone ou email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full"
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
                                <TableHead className="hidden md:table-cell">Email</TableHead>
                                <TableHead className="hidden md:table-cell">Cadastro</TableHead>
                                <TableHead>Visitas</TableHead>
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
                                        <TableCell className="hidden md:table-cell">{client.email || "-"}</TableCell>
                                        <TableCell className="hidden md:table-cell">{formatDate(client.created_at)}</TableCell>
                                        <TableCell>{client.total_visits}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => openClientDetails(client)}>
                                                        Ver Detalhes
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        Novo Agendamento
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

                {/* Modal de Novo Cliente */}
                <Dialog open={isNewClientOpen} onOpenChange={setIsNewClientOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                            <DialogDescription>
                                Preencha as informações do cliente para cadastrá-lo no sistema.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">
                                        Nome completo
                                    </label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Nome do cliente"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium">
                                        Telefone
                                    </label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="(00) 00000-0000"
                                        required
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
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="cliente@exemplo.com"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsNewClientOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit">Cadastrar</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Detalhes do Cliente */}
                <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Detalhes do Cliente</SheetTitle>
                            <SheetDescription>
                                Informações completas sobre o cliente selecionado.
                            </SheetDescription>
                        </SheetHeader>
                        {selectedClient && (
                            <div className="space-y-4 mt-6">
                                <div className="flex items-center space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        <Users size={24} className="text-gray-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{selectedClient.name}</h3>
                                        <p className="text-gray-500 text-sm">Cliente desde {formatDate(selectedClient.created_at)}</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <h4 className="text-sm font-medium mb-2">Informações de Contato</h4>
                                    <p className="flex items-center text-sm py-1">
                                        <span className="font-medium w-24">Telefone:</span> {selectedClient.phone}
                                    </p>
                                    <p className="flex items-center text-sm py-1">
                                        <span className="font-medium w-24">Email:</span> {selectedClient.email || "Não informado"}
                                    </p>
                                </div>

                                <div className="pt-4 border-t">
                                    <h4 className="text-sm font-medium mb-2">Histórico</h4>
                                    <p className="flex items-center text-sm py-1">
                                        <span className="font-medium w-24">Total de visitas:</span> {selectedClient.total_visits}
                                    </p>
                                    <p className="flex items-center text-sm py-1">
                                        <span className="font-medium w-24">Última visita:</span> {selectedClient.last_visit ? formatDate(selectedClient.last_visit) : "Nunca"}
                                    </p>
                                </div>
                            </div>
                        )}
                        <SheetFooter className="mt-6 flex space-x-2">
                            <Button variant="outline" className="flex-1">
                                Editar
                            </Button>
                            <Button className="flex-1">
                                Novo Agendamento
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>

                <Toaster position="bottom-right" />
            </div>
        </AdminLayout>
    );
}