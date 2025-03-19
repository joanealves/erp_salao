import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface NewClientModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    newClient: {
        name: string;
        phone: string;
        email: string;
    };
    formErrors: {
        name: string;
        phone: string;
        email: string;
    };
    loading: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCreateClient: () => void;
}

const NewClientModal: React.FC<NewClientModalProps> = ({
    isOpen,
    onOpenChange,
    newClient,
    formErrors,
    loading,
    onInputChange,
    onCreateClient,
}) => {
    // Função para lidar com a submissão do formulário
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreateClient();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Novo Cliente</DialogTitle>
                    <DialogDescription>
                        Preencha os dados para cadastrar um novo cliente.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">
                                Nome
                            </label>
                            <Input
                                id="name"
                                name="name"
                                value={newClient.name}
                                onChange={onInputChange}
                                placeholder="Nome completo"
                                className={formErrors.name ? "border-red-500" : ""}
                            />
                            {formErrors.name && (
                                <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium">
                                Telefone
                            </label>
                            <Input
                                id="phone"
                                name="phone"
                                value={newClient.phone}
                                onChange={onInputChange}
                                placeholder="(00) 00000-0000"
                                className={formErrors.phone ? "border-red-500" : ""}
                            />
                            {formErrors.phone && (
                                <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email (opcional)
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={newClient.email}
                                onChange={onInputChange}
                                placeholder="email@exemplo.com"
                                className={formErrors.email ? "border-red-500" : ""}
                            />
                            {formErrors.email && (
                                <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Salvando..." : "Salvar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NewClientModal;