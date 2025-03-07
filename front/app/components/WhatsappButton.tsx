"use client";

import { FaWhatsapp } from "react-icons/fa";

const WhatsappButton = () => {
  const phone = "5511000000000";

  return (
    <a
      href={`https://wa.me/${phone}?text=Ol%C3%A1,%20gostaria%20de%20agendar%20um%20hor%C3%A1rio`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition"
    >
      <FaWhatsapp size={24} />
    </a>
  );
};

export default WhatsappButton;
