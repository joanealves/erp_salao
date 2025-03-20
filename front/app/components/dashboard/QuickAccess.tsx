import { CalendarDays, Users, BarChart3 } from "lucide-react";
import QuickAccessCard from "./QuickAccessCard";

export default function QuickAccess() {
    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Acesso Rápido</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <QuickAccessCard
                    href="/admin/appointments"
                    icon={CalendarDays}
                    title="Agendamentos"
                    description="Gerenciar agendamentos e horários"
                    color="green"
                />
                <QuickAccessCard
                    href="/admin/clients"
                    icon={Users}
                    title="Clientes"
                    description="Gerenciar cadastro de clientes"
                    color="green"
                />
                <QuickAccessCard
                    href="/admin/reports"
                    icon={BarChart3}
                    title="Relatórios"
                    description="Análise detalhada do negócio"
                    color="purple"
                />
            </div>
        </div>
    );
}