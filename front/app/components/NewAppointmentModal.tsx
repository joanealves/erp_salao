import { useState, useEffect } from "react";
import { fetchServices, fetchClients, createAppointment } from "../../services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppointmentCreatePayload } from "../../services/api";
import { toast } from "sonner";
import { Calendar, Clock, User, Phone, Mail, Scissors } from "lucide-react";

interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
}

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadServices();
    }
  }, [isOpen]);

  const loadServices = async () => {
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (error) {
      toast.error("Erro ao carregar serviços");
    }
  };

  const handleSubmit = async () => {
    if (!selectedService || !date || !time || !name || !phone) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);

    try {
      const cleanedPhone = cleanPhone(phone);
      // Busca clientes usando o telefone limpo
      const clients = await fetchClients(cleanedPhone);

      // Inicializa clientId como null explicitamente 
      let clientId: number | null = null;

      if (clients && clients.length > 0) {
        clientId = clients[0].id;
      }

      const selectedServiceObject = services.find(s => s.id === Number(selectedService));

      if (!selectedServiceObject) {
        toast.error("Serviço selecionado não encontrado");
        setIsLoading(false);
        return;
      }

      // Certifique-se de que o formato da data está correto (YYYY-MM-DD)
      const formattedDate = date; // Assumindo que já está no formato correto

      // Certifique-se de que o formato da hora está correto (HH:MM)
      const formattedTime = time; // Assumindo que já está no formato correto

      // Crie o payload exatamente como no BookingForm
      const appointmentData: AppointmentCreatePayload = {
        service: selectedServiceObject.name,
        date: formattedDate,
        time: formattedTime,
        name,
        phone: cleanedPhone,
        client_id: clientId  // Sem definir status explicitamente, como no BookingForm
      };

      console.log("Dados a serem enviados:", appointmentData);

      const success = await createAppointment(appointmentData);

      if (success) {
        toast.success("Agendamento realizado com sucesso!");
        resetForm();
        onSuccess();
        onClose();
      } else {
        toast.error("Erro ao realizar agendamento");
      }
    } catch (error: any) {
      console.error("Erro no agendamento:", error);
      toast.error(error?.response?.data?.detail || "Ocorreu um erro ao processar seu agendamento");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedService("");
    setDate("");
    setTime("");
    setName("");
    setPhone("");
    setEmail("");
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");

    if (numbers.length <= 11) {
      let formatted = numbers;
      if (numbers.length > 2) {
        formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
      }
      if (numbers.length > 7) {
        formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
      }
      return formatted;
    }
    return value;
  };

  const cleanPhone = (value: string) => {
    return value.replace(/\D/g, "");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhone(e.target.value);
    setPhone(formattedPhone);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => {
      if (!isOpen) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent className="p-6 rounded-xl shadow-lg border border-gray-100 bg-white max-w-md mx-auto">
        <DialogHeader className="mb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-800">Novo Agendamento</DialogTitle>
            <Scissors className="h-5 w-5 text-green-600" />
          </div>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Serviço *</label>
            <div className="relative">
              <Select value={selectedService} onValueChange={setSelectedService} required>
                <SelectTrigger className="w-full pl-10 h-12 rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500 hover:border-green-400 transition-colors">
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Scissors className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Data *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  className="pl-10 h-12 rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500 hover:border-green-400 transition-colors"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Horário *</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  className="pl-10 h-12 rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500 hover:border-green-400 transition-colors"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nome Completo *</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                className="pl-10 h-12 rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500 hover:border-green-400 transition-colors"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Telefone *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                className="pl-10 h-12 rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500 hover:border-green-400 transition-colors"
                type="tel"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={handlePhoneChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email (opcional)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                className="pl-10 h-12 rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500 hover:border-green-400 transition-colors"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleSubmit}
              className="w-full h-12 mt-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              aria-label="Botão de Confirmar Agendamento"
              disabled={isLoading}
            >
              {isLoading ? "Processando..." : "Confirmar Agendamento"}
            </Button>
          </DialogFooter>

          <p className="text-xs text-gray-500 text-center mt-2">
            * Campos obrigatórios
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewAppointmentModal;