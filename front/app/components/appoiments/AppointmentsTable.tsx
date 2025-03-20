import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
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

interface AppointmentsTableProps {
    appointments: Appointment[];
    loading: boolean;
    onViewDetails: (appointment: Appointment) => void;
    onUpdateStatus: (id: number, status: string) => void;
}

export default function AppointmentsTable({
    appointments,
    loading,
    onViewDetails,
    onUpdateStatus,
}: AppointmentsTableProps) {
    const handleSendSMS = (phone: string) => {
        toast.success(`SMS enviado para ${phone}`);
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
                            <TableCell>{appt.name}</TableCell>
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
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => onViewDetails(appt)}>
                                            Ver Detalhes
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleSendSMS(appt.phone)}>
                                            Enviar SMS
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => onUpdateStatus(appt.id, "confirmed")}>
                                            Confirmar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onUpdateStatus(appt.id, "canceled")}>
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