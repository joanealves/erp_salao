import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DashboardHeaderProps {
    timeframe: string;
    setTimeframe: (value: string) => void;
    exportToCSV: () => void;
}

export default function DashboardHeader({ timeframe, setTimeframe, exportToCSV }: DashboardHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Painel Administrativo</h1>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="day">Hoje</SelectItem>
                        <SelectItem value="week">Semana</SelectItem>
                        <SelectItem value="month">Mês</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" aria-label="Opção para exportar arquivos em CSV" onClick={exportToCSV}>
                    <Download className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">Exportar</span>
                </Button>
            </div>
        </div>
    );
}