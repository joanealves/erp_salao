// components/ClientSearch.tsx
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ClientSearchProps = {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onSubmit: (e: React.FormEvent) => void;
};

export default function ClientSearch({ searchQuery, setSearchQuery, onSubmit }: ClientSearchProps) {
    return (
        <Card className="mb-6">
            <div className="p-4 md:p-6">
                <form onSubmit={onSubmit} className="flex space-x-2">
                    <Input
                        type="text"
                        placeholder="Pesquisar por nome, telefone ou email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                    />
                    <Button type="submit" variant="secondary">
                        <Search size={16} />
                    </Button>
                </form>
            </div>
        </Card>
    );
}