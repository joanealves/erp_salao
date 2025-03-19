import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface ClientsHeaderProps {
    onNewClient: () => void;
}

const ClientsHeader: React.FC<ClientsHeaderProps> = ({ onNewClient }) => {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">Clientes</h1>
                <p className="text-gray-500 mt-1">Gerenciar cadastro de clientes</p>
            </div>
            <div className="flex mt-4 md:mt-0 space-x-2">
                <Button onClick={onNewClient} className="flex items-center space-x-2">
                    <UserPlus size={16} />
                    <span>Novo Cliente</span>
                </Button>
            </div>
        </div>
    );
};

export default ClientsHeader;