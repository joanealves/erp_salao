// components/ClientDetailsSheet.tsx
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Client } from "../types";
import { formatDate } from "../utils/formatters";

type ClientDetailsSheetProps = {
    client: Client | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function ClientDetailsSheet({ client, isOpen, onOpenChange }: ClientDetailsSheetProps) {
    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Detalhes do Cliente</SheetTitle>
                    <SheetDescription>
                        Informações completas sobre o cliente selecionado.
                    </SheetDescription>
                </SheetHeader>
                {client && (
                    <div className="space-y-4 mt-6">
                        <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                                <Users size={24} className="text-gray-600" />
                            </div>
                            <div>
                                <h3 className="font-medium">{client.name}</h3>
                                <p className="text-gray-500 text-sm">Cliente desde {formatDate(client.created_at)}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <h4 className="text-sm font-medium mb-2">Informações de Contato</h4>
                            <p className="flex items-center text-sm py-1">
                                <span className="font-medium w-24">Telefone:</span> {client.phone}
                            </p>
                            <p className="flex items-center text-sm py-1">
                                <span className="font-medium w-24">Email:</span> {client.email || "Não informado"}
                            </p>
                        </div>

                        <div className="pt-4 border-t">
                            <h4 className="text-sm font-medium mb-2">Histórico</h4>
                            <p className="flex items-center text-sm py-1">
                                <span className="font-medium w-24">Total de visitas:</span> {client.total_visits}
                            </p>
                            <p className="flex items-center text-sm py-1">
                                <span className="font-medium w-24">Última visita:</span> {client.last_visit ? formatDate(client.last_visit) : "Nunca"}
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
    );
}