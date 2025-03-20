import { Button } from "@/components/ui/button";
import { Clock, RefreshCw } from "lucide-react";

interface AppointmentsHeaderProps {
    onRefresh: () => void;
    refreshing: boolean;
    onNewAppointment: () => void;
}

export default function AppointmentsHeader({ onRefresh, refreshing, onNewAppointment }: AppointmentsHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">Gerenciar Agendamentos</h1>
                <p className="text-gray-500 mt-1">Visualize e gerencie todos os agendamentos</p>
            </div>
            <div className="flex mt-4 md:mt-0 space-x-2">
                <Button
                    variant="outline"
                    onClick={onRefresh}
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
                    onClick={onNewAppointment}
                    className="flex items-center space-x-2"
                >
                    <Clock size={16} />
                    <span>Novo Agendamento</span>
                </Button>
            </div>
        </div>
    );
}