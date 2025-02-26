"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Configurar Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Service {
  id: number;
  name: string;
  price: number;
}

const BookingForm = () => {
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar serviços disponíveis
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase.from("services").select("*");

        if (error) throw error;

        setServices(data || []);
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
      }
    };

    fetchServices();
  }, []);

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let clientId: number;

      // Verificar se o cliente já existe pelo telefone
      const { data: existingClients, error: clientError } = await supabase
        .from("clients")
        .select("id, email") // Buscar também o e-mail salvo
        .eq("phone", phone)
        .limit(1);

      if (clientError) throw clientError;

      if (existingClients && existingClients.length > 0) {
        // Cliente já existe, pegar o ID
        clientId = existingClients[0].id;

        // Atualizar o nome e email APENAS se o email for diferente
        if (existingClients[0].email !== email) {
          await supabase.from("clients").update({ name, email }).eq("id", clientId);
        }
      } else {
        // Cliente não existe, criar um novo
        const { data: newClient, error: createError } = await supabase
          .from("clients")
          .insert([{ name, phone, email }])
          .select("id")
          .single();

        if (createError) throw createError;
        clientId = newClient.id;
      }

      // Inserir o agendamento
      const { error: appointmentError } = await supabase.from("appointments").insert([
        {
          service,
          date,
          time,
          client_id: clientId,
          name, // Caso ainda esteja na tabela
          status: "pendente",
        },
      ]);

      if (appointmentError) throw appointmentError;

      setIsSubmitted(true);
    } catch (err) {
      console.error("Erro ao processar agendamento:", err);
      setError("Ocorreu um erro ao agendar. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className="py-16 bg-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800">
          {isSubmitted ? "Agendamento Confirmado!" : "Agende seu Horário"}
        </h2>
      </div>
      {isSubmitted ? (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-700 mb-4">Seu agendamento foi realizado com sucesso!</p>
          <button
            className="mt-6 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-semibold transition"
            onClick={() => setIsSubmitted(false)}
          >
            Fazer Novo Agendamento
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <select value={service} onChange={(e) => setService(e.target.value)} className="w-full border p-2 rounded mb-4" required>
            <option value="">Selecione um serviço</option>
              {services.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
          </select>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border p-2 rounded mb-4" required />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full border p-2 rounded mb-4" required />
          <input type="text" placeholder="Seu Nome" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded mb-4" required />
          <input type="tel" placeholder="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border p-2 rounded mb-4" required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 rounded mb-4" required />
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 p-2 text-white rounded font-semibold" disabled={loading}>
            {loading ? "Aguarde..." : "Confirmar Agendamento"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      )}
    </section>
  );
};

export default BookingForm;