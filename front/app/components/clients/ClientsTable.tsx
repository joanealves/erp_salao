import React from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

type Client = {
    id: number;
    name: string;
    phone: string;
    email: string;
    last_visit: string;
    total_visits: number;
    created_at: string;
};

interface ClientsTableProps {
    clients: Client[];
    loading: boolean;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    formatDate: (dateStr: string) => string;
    onViewDetails: (client: Client) => void;
    onEditClient: (client: Client) => void;
    onDeleteClient: (clientId: number) => void;
    onNewSchedule: (client: Client) => void;
}

const ClientsTable: React.FC<ClientsTableProps> = ({
    clients,
    loading,
    page,
    totalPages,
    onPageChange,
    formatDate,
    onViewDetails,
    onEditClient,
    onDeleteClient,
    onNewSchedule,
}) => {
    return (
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
                                            <DropdownMenuItem
                                                onSelect={() => onViewDetails(client)}
                                            >
                                                Ver Detalhes
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onSelect={() => onEditClient(client)}
                                            >
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onSelect={() => onNewSchedule(client)}
                                            >
                                                Novo Agendamento
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-red-600"
                                                onSelect={() => onDeleteClient(client.id)}
                                            >
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
                            onClick={() => page > 1 && onPageChange(page - 1)}
                            className={page === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink isActive>{page}</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => page < totalPages && onPageChange(page + 1)}
                            className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </Card>
    );
};

export default ClientsTable;