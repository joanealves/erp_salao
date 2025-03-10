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
    <section className="relative h-screen flex items-center justify-center text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-gray-900/10"></div>

      <Image
        src={heroImage}
        alt="Salon"
        layout="fill"
        objectFit="cover"
        quality={90}
        priority
      />

      <div className="text-center relative z-10 p-8 rounded-lg">
        <div className="bg-white/10 backdrop-blur p-8 rounded-lg">
          <h1 className="text-5xl font-bold text-white text-shadow-sm">
            Realce sua Beleza
          </h1>
          <p className="mt-4 text-lg font-bold text-gray-300 text-shadow-sm">
            Agende seu horário e tenha uma experiência incrível!
          </p>

          <button
            onClick={scrollToBooking}
            className="mt-6 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-semibold transition shadow-lg"
          >
            Agendar Agora
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
