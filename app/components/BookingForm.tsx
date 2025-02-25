"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Configurar Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Supabase Anon Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const BookingForm = () => {
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data, error } = await supabase.from("appointments").insert([
      { service, date, time, name, phone }
    ]);

    if (error) {
      console.error("Erro ao agendar:", error.message);
      return;
    }

    console.log("Agendamento realizado:", data);
    setIsSubmitted(true);
  };

  return (
    <section id="booking" className="py-16 bg-gray-100">
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
          <select
            value={service}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setService(e.target.value)}
            className="w-full border p-2 rounded mb-4"
            required
          >
            <option value="">Selecione um serviço</option>
            <option value="Corte de Cabelo">Corte de Cabelo</option>
            <option value="Coloração">Coloração</option>
            <option value="Hidratação">Hidratação</option>
          </select>
          <input
            type="date"
            value={date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
            className="w-full border p-2 rounded mb-4"
            required
          />
          <input
            type="time"
            value={time}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTime(e.target.value)}
            className="w-full border p-2 rounded mb-4"
            required
          />
          <input
            type="text"
            placeholder="Seu Nome"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            className="w-full border p-2 rounded mb-4"
            required
          />
          <input
            type="tel"
            placeholder="Telefone"
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
            className="w-full border p-2 rounded mb-4"
            required
          />
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 p-2 text-white rounded font-semibold">
            Confirmar Agendamento
          </button>
        </form>
      )}
    </section>
  );
};

export default BookingForm;