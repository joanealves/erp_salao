import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface ClientsSearchProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

const ClientsSearch: React.FC<ClientsSearchProps> = ({
    searchQuery,
    onSearchChange,
    onSubmit,
}) => {
    return (
        <Card className="mb-6">
            <div className="p-4 md:p-6">
                <form onSubmit={onSubmit} className="flex space-x-2">
                    <Input
                        type="text"
                        placeholder="Pesquisar por nome, telefone ou email..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full md:w-[350px]"
                    />
                    <Button type="submit" variant="secondary">
                        <Search size={16} />
                    </Button>
                </form>
            </div>
        </Card>
    );
};

export default ClientsSearch;