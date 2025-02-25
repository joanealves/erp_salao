"use client";

import { useState } from "react";

const BookingForm = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  return (
    <section id="booking" className="py-16">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold">Agende seu Horário</h2>
      </div>
      <form className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Seu Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <button type="submit" className="w-full bg-pink-500 p-2 text-white rounded">
          Confirmar Agendamento
        </button>
      </form>
    </section>
  );
};

export default BookingForm;
