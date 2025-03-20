import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from "@/components/ui/sheet";
import { Appointment, AppointmentStatus } from "../../types/appointment";
import { formatDate, getStatusBadge } from "../../../lib/utils/appoiment";
import { getStatusText } from "./AppointmentsTable";

interface AppointmentDetailsProps {
    appointment: Appointment | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AppointmentDetails({
    appointment,
    isOpen,
    onOpenChange,
}: AppointmentDetailsProps) {
    if (!appointment) {
        return null;
    }

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Detalhes do Agendamento</SheetTitle>
                    <SheetDescription>
                        Informações completas sobre o agendamento selecionado.
                    </SheetDescription>
                </SheetHeader>
                <div className="space-y-4">
                    <p><strong>Nome:</strong> {appointment.name}</p>
                    <p><strong>Telefone:</strong> {appointment.phone}</p>
                    <p><strong>Serviço:</strong> {appointment.service}</p>
                    <p><strong>Data:</strong> {formatDate(appointment.date)} às {appointment.time}</p>
                    <p><strong>Status:</strong>
                        <Badge className="ml-2" variant={getStatusBadge(appointment.status as AppointmentStatus)}>
                            {getStatusText(appointment.status as AppointmentStatus)}
                        </Badge>
                    </p>
                </div>
                <SheetFooter className="mt-6">
                    <SheetClose asChild>
                        <Button variant="outline">Fechar</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}