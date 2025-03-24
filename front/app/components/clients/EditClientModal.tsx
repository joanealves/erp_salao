import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { toast } from "sonner";

type Client = {
    id: number;
    name: string;
    phone: string;
    email: string;
};

interface EditClientModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    client: Client;
}

const EditClientModal: React.FC<EditClientModalProps> = ({
    isOpen,
    onOpenChange,
    client
}) => {
    const [editedClient, setEditedClient] = useState<Client>({
        id: 0,
        name: "",
        phone: "",
        email: ""
    });
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({
        name: "",
        phone: "",
        email: ""
    });

    useEffect(() => {
        // Preenche o formulário com os dados do cliente selecionado
        if (client) {
            setEditedClient({
                id: client.id,
                name: client.name,
                phone: client.phone,
                email: client.email || ""
            });
        }
    }, [client]);

    const validateForm = () => {
        let isValid = true;
        const errors = {
            name: "",
            phone: "",
            email: ""
        };

        if (!editedClient.name || editedClient.name.length < 3) {
            errors.name = "Nome deve ter pelo menos 3 caracteres";
            isValid = false;
        }

        if (!editedClient.phone || editedClient.phone.length < 8) {
            errors.phone = "Telefone deve ter pelo menos 8 caracteres";
            isValid = false;
        }

        if (editedClient.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(editedClient.email)) {
            errors.email = "Email inválido";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedClient(prev => ({ ...prev, [name]: value }));

        if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleUpdateClient = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const response = await axios.put(`${API_URL}/clients/${editedClient.id}`, {
                name: editedClient.name.trim(),
                phone: editedClient.phone.trim(),
                email: editedClient.email.trim() || null
            });

            toast.success("Cliente atualizado com sucesso");
            onOpenChange(false);
        } catch (error: any) {
            console.error("Error updating client:", error);

            if (error.response) {
                const status = error.response.status;

                if (status === 422 && error.response.data.detail) {
                    const apiErrors = error.response.data.detail;

                    const newErrors = { name: "", phone: "", email: "" };
                    if (Array.isArray(apiErrors)) {
                        apiErrors.forEach((err: any) => {
                            if (err.loc && err.loc.length > 1) {
                                const field = err.loc[1];
                                if (field in newErrors) {
                                    newErrors[field as keyof typeof newErrors] = err.msg;
                                }
                            }
                        });
                    }

                    setFormErrors(newErrors);
                    toast.error("Verifique os dados do formulário");
                } else {
                    toast.error(`Erro ao atualizar cliente: ${error.response.data?.detail || "Erro desconhecido"}`);
                }
            } else {
                toast.error("Erro ao enviar requisição.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Cliente</DialogTitle>
                    <DialogDescription>
                        Atualize as informações do cliente.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Nome
                        </label>
                        <Input
                            id="name"
                            name="name"
                            value={editedClient.name}
                            onChange={handleInputChange}
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
                            value={editedClient.phone}
                            onChange={handleInputChange}
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
                            value={editedClient.email}
                            onChange={handleInputChange}
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
                    <Button
                        type="button"
                        onClick={handleUpdateClient}
                        disabled={loading}
                    >
                        {loading ? "Salvando..." : "Salvar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditClientModal;