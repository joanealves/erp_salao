"use client";

import Image from "next/image";
import heroImage from "../assets/hero.jpg";

const Hero = () => {
  const scrollToBooking = () => {
    const formSection = document.getElementById("booking");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      // Opção 1: Posicionar mais abaixo
      className="relative h-screen flex items-start justify-center pt-96 text-white"
      // Opção 2: Posicionar à direita
      // className="relative h-screen flex items-center justify-end pr-24 text-white"
      role="region"
      aria-labelledby="titulo-principal"
    >
      {/* Gradiente de fundo para contraste */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-gray-900/30"></div>

      {/* Imagem de fundo */}
      <Image
        src={heroImage}
        alt="Imagem de um salão de beleza"
        layout="fill"
        objectFit="cover"
        quality={90}
        priority
        aria-hidden="true" 
      />

      {/* Conteúdo Central */}
      <div className="text-center relative z-10 p-8 rounded-lg">
        <div
          className="bg-white/10 backdrop-blur p-8 rounded-lg"
          role="region"
          aria-label="Informações de agendamento"
        >
          <h1
            id="titulo-principal"
            className="text-5xl font-bold text-white text-shadow-sm"
          >
            Realce sua Beleza
          </h1>
          <p className="mt-4 text-lg font-bold text-gray-200 text-shadow-sm">
            Agende seu horário e tenha uma experiência incrível!
          </p>

          <button
            onClick={scrollToBooking}
            className="mt-6 bg-green-700 hover:bg-green-800 px-6 py-3 rounded-lg 
                      text-white font-semibold transition shadow-lg 
                      focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-700"
            aria-label="Agendar um horário no salão de beleza"
          >
            Agendar Agora
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;