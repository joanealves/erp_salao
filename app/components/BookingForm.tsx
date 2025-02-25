"use client";
import { useState } from "react";

const BookingForm = () => {
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirming, setConfirming] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setConfirming(true);
  };

  const handleConfirm = () => {
    console.log({ service, date, time, name, phone });
    // Aqui será feita a integração com Supabase
    alert("Agendamento confirmado!");
    // Resetando os campos após a confirmação
    setService("");
    setDate("");
    setTime("");
    setName("");
    setPhone("");
    setConfirming(false);
  };

  return (
    <section id="booking" className="py-16 bg-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800">Agende seu Horário</h2>
      </div>

      {!confirming ? (
        // Formulário de Agendamento
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
        >
          <select
            value={service}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setService(e.target.value)
            }
            className="w-full border p-2 rounded mb-4"
            required
          >
            <option value="">Selecione um serviço</option>
            <option value="corte">Corte de Cabelo</option>
            <option value="coloracao">Coloração</option>
            <option value="hidratacao">Hidratação</option>
          </select>
          <input
            type="date"
            value={date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDate(e.target.value)
            }
            className="w-full border p-2 rounded mb-4"
            required
          />
          <input
            type="time"
            value={time}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTime(e.target.value)
            }
            className="w-full border p-2 rounded mb-4"
            required
          />
          <input
            type="text"
            placeholder="Seu Nome"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            className="w-full border p-2 rounded mb-4"
            required
          />
          <input
            type="tel"
            placeholder="Telefone"
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPhone(e.target.value)
            }
            className="w-full border p-2 rounded mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 p-2 text-white rounded font-semibold"
          >
            Próximo
          </button>
        </form>
      ) : (
        // Tela de Confirmação
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Confirme seu Agendamento
          </h3>
          <p className="text-gray-600">
            <strong>Serviço:</strong> {service}
          </p>
          <p className="text-gray-600">
            <strong>Data:</strong> {date}
          </p>
          <p className="text-gray-600">
            <strong>Hora:</strong> {time}
          </p>
          <p className="text-gray-600">
            <strong>Nome:</strong> {name}
          </p>
          <p className="text-gray-600">
            <strong>Telefone:</strong> {phone}
          </p>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setConfirming(false)}
              className="w-1/2 bg-gray-400 hover:bg-gray-500 p-2 text-white rounded font-semibold mr-2"
            >
              Voltar
            </button>
            <button
              onClick={handleConfirm}
              className="w-1/2 bg-green-600 hover:bg-green-700 p-2 text-white rounded font-semibold"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default BookingForm;
