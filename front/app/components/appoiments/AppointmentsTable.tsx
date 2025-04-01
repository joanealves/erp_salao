
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Clock, Check, X, UserCheck } from "lucide-react";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Appointment, AppointmentStatus } from "../../types/appointment";
import { formatDate, getStatusBadge } from "../../../lib/utils/appoiment";
import { useState } from "react";

interface AppointmentsTableProps {
    appointments: Appointment[];
    loading: boolean;
    onViewDetails: (appointment: Appointment) => void;
    onUpdateStatus: (id: number, status: string) => void;
    onRefresh: () => void;
}

export default function AppointmentsTable({
    appointments,
    loading,
    onViewDetails,
    onUpdateStatus,
    onRefresh,
}: AppointmentsTableProps) {
    const [updatingStatus, setUpdatingStatus] = useState<Record<number, boolean>>({});

    const handleUpdateStatus = async (id: number, newStatus: AppointmentStatus, appointment: Appointment) => {
        try {
            setUpdatingStatus(prev => ({ ...prev, [id]: true }));

            await onUpdateStatus(id, newStatus);

            if (newStatus === "confirmed") {
                toast.success(`Agendamento confirmado`, {
                    description: `${appointment.service} para ${appointment.name} foi confirmado.`
                });
            } else if (newStatus === "canceled") {
                toast.success(`Agendamento cancelado`, {
                    description: `${appointment.service} para ${appointment.name} foi cancelado.`
                });
            } else if (newStatus === "completed") {
                toast.success(`Agendamento marcado como concluído`, {
                    description: `${appointment.service} para ${appointment.name} foi finalizado.`
                });
            }

            onRefresh();
        } catch (error) {
            console.error(`Erro ao atualizar status para ${newStatus}:`, error);
            toast.error(`Falha ao atualizar para ${getStatusText(newStatus)}`, {
                description: "Tente novamente ou verifique a conexão."
            });
        } finally {
            setUpdatingStatus(prev => ({ ...prev, [id]: false }));
        }
    };

    return (
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
                            <TableCell className="font-medium">{appt.name}</TableCell>
                            <TableCell>{appt.phone}</TableCell>
                            <TableCell>{appt.service}</TableCell>
                            <TableCell>{formatDate(appt.date)} às {appt.time}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusBadge(appt.status as AppointmentStatus)}>
                                    {getStatusText(appt.status as AppointmentStatus)}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical size={16} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onViewDetails(appt)}>
                                            <Clock className="mr-2 h-4 w-4" />
                                            Ver Detalhes
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator />

                                        {/* Opção de confirmar - mostrada apenas para pendentes */}
                                        {appt.status === "pending" && (
                                            <DropdownMenuItem
                                                onClick={() => handleUpdateStatus(appt.id, "confirmed", appt)}
                                                disabled={updatingStatus[appt.id]}
                                            >
                                                <Check className="mr-2 h-4 w-4 text-green-600" />
                                                {updatingStatus[appt.id] ? 'Confirmando...' : 'Confirmar'}
                                            </DropdownMenuItem>
                                        )}

                                        {/* Opção de marcar como concluído - mostrada para pendentes e confirmados */}
                                        {(appt.status === "pending" || appt.status === "confirmed") && (
                                            <DropdownMenuItem
                                                onClick={() => handleUpdateStatus(appt.id, "completed", appt)}
                                                disabled={updatingStatus[appt.id]}
                                            >
                                                <UserCheck className="mr-2 h-4 w-4 text-blue-600" />
                                                {updatingStatus[appt.id] ? 'Marcando...' : 'Marcar como Concluído'}
                                            </DropdownMenuItem>
                                        )}

                                        {/* Opção de cancelar - mostrada para todos exceto já cancelados */}
                                        {appt.status !== "canceled" && (
                                            <DropdownMenuItem
                                                onClick={() => handleUpdateStatus(appt.id, "canceled", appt)}
                                                disabled={updatingStatus[appt.id]}
                                                className="text-red-600"
                                            >
                                                <X className="mr-2 h-4 w-4" />
                                                {updatingStatus[appt.id] ? 'Cancelando...' : 'Cancelar'}
                                            </DropdownMenuItem>
                                        )}
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
    );
}

export const getStatusText = (status: AppointmentStatus): string => {
    const statusMap: Record<AppointmentStatus, string> = {
        pending: "Pendente",
        confirmed: "Confirmado",
        completed: "Concluído",
        canceled: "Cancelado",
    };
    return statusMap[status] || "Pendente";
};