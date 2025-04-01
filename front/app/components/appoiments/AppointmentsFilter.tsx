import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
    const hasActiveFilters = filter !== 'all' || dateFilter !== '' || searchQuery !== '';
    
    const handleClearFilters = () => {
        setFilter('all');
        setDateFilter('');
        setSearchQuery('');
    };

    return (
        <Card className="mb-6 overflow-hidden border-0 shadow-sm">
            <CardContent className="p-0">
                <div className="bg-white dark:bg-gray-800 rounded-lg">
                    <div className="px-4 py-3 border-b bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Filter size={16} className="text-muted-foreground" />
                            <h3 className="text-sm font-medium">Filtros</h3>
                        </div>
                        {hasActiveFilters && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={handleClearFilters}
                                className="h-8 text-xs"
                            >
                                <X size={14} className="mr-1" />
                                Limpar filtros
                            </Button>
                        )}
                    </div>
                
                    <div className="p-4 lg:flex lg:items-center lg:space-x-4">
                        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 w-full lg:w-auto">
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                    <Filter size={16} />
                                </div>
                                <Select 
                                    value={filter} 
                                    onValueChange={setFilter}
                                >
                                    <SelectTrigger 
                                        className={cn(
                                            "w-full pl-10 h-10", 
                                            filter !== 'all' && "border-green-500 dark:border-green-600"
                                        )}
                                    >
                                        <SelectValue placeholder="Filtrar por status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos os status</SelectItem>
                                        <SelectItem value="pending">Pendente</SelectItem>
                                        <SelectItem value="confirmed">Confirmado</SelectItem>
                                        <SelectItem value="completed">Concluído</SelectItem>
                                        <SelectItem value="canceled">Cancelado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                    <Calendar size={16} />
                                </div>
                                <Input
                                    type="date"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    placeholder="Filtrar por data"
                                    className={cn(
                                        "w-full pl-10 h-10", 
                                        dateFilter && "border-green-500 dark:border-green-600"
                                    )}
                                />
                            </div>
                        </div>
                        
                        <div className="mt-3 lg:mt-0 lg:ml-auto">
                            <form onSubmit={onSearchSubmit} className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                    <Search size={16} />
                                </div>
                                <Input
                                    type="text"
                                    placeholder="Buscar cliente ou serviço..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={cn(
                                        "w-full pl-10 pr-10 h-10", 
                                        searchQuery && "border-green-500 dark:border-green-600"
                                    )}
                                />
                                {searchQuery && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                                        onClick={() => setSearchQuery('')}
                                    >
                                        <X size={14} />
                                    </Button>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}