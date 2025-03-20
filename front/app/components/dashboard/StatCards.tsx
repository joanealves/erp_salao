import { CalendarDays, Users, DollarSign, Clock } from "lucide-react";
import StatCard from "./StatCard";

interface Stats {
    todayAppointments: number;
    pendingAppointments: number;
    totalClients: number;
    revenue: number;
}

interface StatCardsProps {
    stats: Stats;
}

export default function StatCards({ stats }: StatCardsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
                icon={CalendarDays}
                title="Agendamentos Hoje"
                value={stats.todayAppointments}
                color="blue"
            />
            <StatCard
                icon={Clock}
                title="Pendentes"
                value={stats.pendingAppointments}
                color="amber"
            />
            <StatCard
                icon={Users}
                title="Total de Clientes"
                value={stats.totalClients}
                color="green"
            />
            <StatCard
                icon={DollarSign}
                title="Faturamento"
                value={`R$ ${stats.revenue}`}
                color="purple"
            />
        </div>
    );
}