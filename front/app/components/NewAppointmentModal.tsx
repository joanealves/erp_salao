// app/admin/appointments/components/NewAppointmentModal.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
}

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/services`)
      .then(response => setServices(response.data))
      .catch(error => toast.error("Erro ao carregar serviços"));
  }, []);

  const handleSubmit = async () => {
    if (!selectedService || !date || !customerName) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      await axios.post(`${API_URL}/appointments`, {
        service_id: selectedService,
        date,
        customer_name: customerName
      });
      toast.success("Agendamento criado com sucesso");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Erro ao criar agendamento");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
        </DialogHeader>
        <Label>Nome do Cliente</Label>
        <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />

        <Label>Serviço</Label>
        <Select onValueChange={(value) => setSelectedService(Number(value))}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um serviço" />
          </SelectTrigger>
          <SelectContent>
            {services.map(service => (
              <SelectItem key={service.id} value={String(service.id)}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Label>Data</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {date ? format(date, "dd/MM/yyyy") : "Selecione uma data"}
              <CalendarIcon className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar mode="single" selected={date} onSelect={(day) => setDate(day ?? undefined)} />
          </PopoverContent>
        </Popover>

        <DialogFooter>
          <Button onClick={handleSubmit}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewAppointmentModal;
