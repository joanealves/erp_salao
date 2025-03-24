import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type Client = {
    id: number;
    name: string;
    phone: string;
    email: string;
    last_visit: string;
    total_visits: number;
    created_at: string;
};

interface DetailsClientModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    client: Client | null;
    formatDate: (dateStr: string) => string;
}

const DetailsClientModal: React.FC<DetailsClientModalProps> = ({
    isOpen,
    onOpenChange,
    client,
    formatDate
}) => {
    if (!client) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detalhes do Cliente</DialogTitle>
                    <DialogDescription>
                        Informações detalhadas do cliente
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <strong>Nome:</strong> {client.name}
                    </div>
                    <div>
                        <strong>Telefone:</strong> {client.phone}
                    </div>
                    <div>
                        <strong>Email:</strong> {client.email || "Não informado"}
                    </div>
                    <div>
                        <strong>Última Visita:</strong> {formatDate(client.last_visit)}
                    </div>
                    <div>
                        <strong>Total de Visitas:</strong> {client.total_visits}
                    </div>
                    <div>
                        <strong>Cadastrado em:</strong> {formatDate(client.created_at)}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DetailsClientModal;