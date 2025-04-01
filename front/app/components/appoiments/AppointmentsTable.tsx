import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Clock, Check, X, UserCheck, Eye } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip";

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
                toast.success(`Agendamento concluído`, {
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

    const getStatusColor = (status: AppointmentStatus) => {
        const statusColors: Record<AppointmentStatus, string> = {
            pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
            confirmed: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
            completed: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
            canceled: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
        };
        return statusColors[status] || statusColors.pending;
    };

    return (
        <div className="relative overflow-x-auto">
            <Table className="w-full">
                <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <TableRow>
                        <TableHead className="font-semibold">Nome</TableHead>
                        <TableHead className="font-semibold">Telefone</TableHead>
                        <TableHead className="font-semibold">Serviço</TableHead>
                        <TableHead className="font-semibold">Data</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-32 text-center">
                                <div className="flex justify-center items-center space-x-2">
                                    <div className="animate-spin w-5 h-5 rounded-full border-2 border-green-600 border-t-transparent"></div>
                                    <span className="text-gray-500">Carregando agendamentos...</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : appointments.length > 0 ? (
                        appointments.map((appt) => (
                            <TableRow
                                key={appt.id}
                                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                <TableCell className="font-medium">{appt.name}</TableCell>
                                <TableCell>{appt.phone}</TableCell>
                                <TableCell>
                                    <div className="max-w-[180px] truncate" title={appt.service}>
                                        {appt.service}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{formatDate(appt.date)}</span>
                                        <span className="text-xs text-muted-foreground">{appt.time}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(appt.status as AppointmentStatus)}`}>
                                        {getStatusText(appt.status as AppointmentStatus)}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end space-x-1">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => onViewDetails(appt)}
                                                        className="h-8 w-8"
                                                    >
                                                        <Eye size={16} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Ver detalhes</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem onClick={() => onViewDetails(appt)}>
                                                    <Eye className="mr-2 h-4 w-4" />
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
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-32 text-center">
                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                    <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-3 mb-2">
                                        <Clock size={20} className="text-slate-400" />
                                    </div>
                                    <p>Nenhum agendamento encontrado.</p>
                                    <p className="text-sm mt-1">Tente ajustar os filtros ou criar um novo agendamento.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
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