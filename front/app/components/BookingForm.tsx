"use client";
import { useState, useEffect } from "react";
import { fetchServices, fetchClients, createAppointment } from "../../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppointmentCreatePayload } from "../../services/api";
import { toast } from "sonner";
import { Calendar } from "lucide-react";

interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
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

const BookingForm = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (error) {
      toast.error("Erro ao carregar serviços");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedService || !date || !time || !name || !phone) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const clients = await fetchClients(phone);
      let clientId: number | undefined;
      
      if (clients.length > 0) {
        clientId = clients[0].id;
      } else {
        clientId = undefined;
      }

      const selectedServiceObject = services.find(s => s.id === Number(selectedService));
      
      if (!selectedServiceObject) {
        toast.error("Serviço selecionado não encontrado");
        setIsLoading(false);
        return;
      }

      const appointmentData: AppointmentCreatePayload = {
        service: selectedServiceObject.name,  
        date,
        time,
        name,  
        phone,
        client_id: clientId,
        // Status é opcional, o backend vai usar o valor padrão "pending"
      };

      console.log("Dados enviados:", appointmentData);
      
      const success = await createAppointment(appointmentData);

      if (success) {
        toast.success("Agendamento realizado com sucesso!");
        // Limpar formulário
        setSelectedService("");
        setDate("");
        setTime("");
        setName("");
        setPhone("");
        setEmail("");
      } else {
        toast.error("Erro ao realizar agendamento");
      }
    } catch (error) {
      console.error("Erro no agendamento:", error);
      toast.error("Ocorreu um erro ao processar seu agendamento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <div className="my-10 text-center">
        <h2 className="text-2xl font-bold text-green-600">Agende seu horário</h2>
    </div>

    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md my-10">

      <h2 className="text-xl font-medium mb-4">Confira nossa agenda</h2>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Serviço</label>
        <Select value={selectedService} onValueChange={setSelectedService} required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um serviço" />
          </SelectTrigger>
          <SelectContent>
            {services.map((s) => (
               <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Data</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input 
            className="pl-10" 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Horário</label>
        <Input 
          type="time" 
          value={time} 
          onChange={(e) => setTime(e.target.value)} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Nome</label>
        <Input 
          type="text" 
          placeholder="Seu nome completo" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Telefone</label>
        <Input 
          type="tel" 
          placeholder="(00) 00000-0000" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Email (opcional)</label>
        <Input 
          type="email" 
          placeholder="seu@email.com" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? "Processando..." : "Confirmar Agendamento"}
      </Button>
      </form>
      </>
  );
};

export default BookingForm;