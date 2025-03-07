import { useState, useEffect } from "react";
import { fetchServices, createAppointment } from "../../services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppointmentCreatePayload } from "../../services/api";
import { toast } from "sonner";

interface Service {
  id: number;
  name: string;
}
// interface AppointmentCreatePayload {
//   service: string;      
//   date: string;          
//   time: string;          
//   name: string;         
//   phone: string;        
//   client_id?: number;   
//   status?: string;       
// }

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const data: Service[] = await fetchServices();
    setServices(data);
  };
const handleSubmit = async () => {
  if (!selectedService || !date || !customerName || !time) {
    toast.error("Preencha todos os campos");
    return;
  }

  setLoading(true);

const appointmentData: AppointmentCreatePayload = {
  service: services.find((s) => s.id === selectedService)?.name || "", // Converte ID para Nome
  date,
  time,
  name: customerName, 
  phone: "00000000000",
  status: "pending",
};

  const success = await createAppointment(appointmentData);

  if (success) {
    toast.success("Agendamento criado com sucesso");
    onSuccess();
    onClose();
  } else {
    toast.error("Erro ao criar agendamento");
  }

  setLoading(false);
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
            {services.map((service) => (
              <SelectItem key={service.id} value={String(service.id)}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Label>Data</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <Label>Horário</Label>
        <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Carregando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewAppointmentModal;
