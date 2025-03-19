import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

type ServicesHeaderProps = {
    onRefresh: () => void;
    onAddNew: () => void;
    refreshing: boolean;
};

export function ServicesHeader({ onRefresh, onAddNew, refreshing }: ServicesHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">Gerenciar Serviços</h1>
                <p className="text-gray-500 mt-1">Cadastre e gerencie os serviços oferecidos</p>
            </div>
            <div className="flex mt-4 md:mt-0 space-x-2">
                <Button
                    variant="outline"
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="flex items-center space-x-2"
                    aria-label="Botão atualizar serviços"
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
                    onClick={onAddNew}
                    className="flex items-center space-x-2"
                    aria-label="Botão novo serviço"
                >
                    <Plus size={16} />
                    <span>Novo Serviço</span>
                </Button>
            </div>
        </div>
    );
}