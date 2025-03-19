// components/NewClientDialog.tsx
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
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
import { ClientFormData } from "../admin/clients/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type NewClientDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClientCreated: () => void;
};

export default function NewClientDialog({ 
  isOpen, 
  onOpenChange, 
  onClientCreated 
}: NewClientDialogProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    phone: "",
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.replace(/\D/g, ""),
        email: formData.email.trim() || null,
      };

      await axios.post(`${API_URL}/clients`, payload);
      setFormData({ name: "", phone: "", email: "" });
      onClientCreated();
      onOpenChange(false);
      toast.success("Cliente cadastrado com sucesso!");
    } catch (error) {
      const axiosError = error as AxiosError<{ detail?: string }>;
      console.error("Erro ao cadastrar cliente:", axiosError);
      toast.error(
        axiosError.response?.data?.detail || 
        "Erro ao cadastrar cliente. Tente novamente."
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
          <DialogDescription>
            Preencha as informações do cliente para cadastrá-lo no sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome completo
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nome do cliente"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Telefone
              </label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(00) 00000-0000"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email (opcional)
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="cliente@exemplo.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Cadastrar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}