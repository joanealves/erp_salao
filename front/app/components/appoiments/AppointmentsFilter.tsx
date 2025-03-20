import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface AppointmentsFilterProps {
    filter: string;
    setFilter: (value: string) => void;
    dateFilter: string;
    setDateFilter: (value: string) => void;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    onSearchSubmit: (e: React.FormEvent) => void;
}

export default function AppointmentsFilter({
    filter,
    setFilter,
    dateFilter,
    setDateFilter,
    searchQuery,
    setSearchQuery,
    onSearchSubmit,
}: AppointmentsFilterProps) {
    return (
        <Card className="mb-6">
            <div className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                <div className="flex space-x-2 w-full md:w-auto">
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Filtrar por status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="confirmed">Confirmado</SelectItem>
                            <SelectItem value="completed">Concluído</SelectItem>
                            <SelectItem value="canceled">Cancelado</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        placeholder="Filtrar por data"
                        className="w-full md:w-[180px]"
                    />
                </div>
                <form onSubmit={onSearchSubmit} className="flex space-x-2 w-full md:w-auto">
                    <Input
                        type="text"
                        placeholder="Pesquisar por nome ou serviço..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-[250px]"
                    />
                    <Button type="submit" variant="secondary">
                        <Clock size={16} />
                    </Button>
                </form>
            </div>
        </Card>
    );
}