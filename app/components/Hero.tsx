import Image from "next/image";
import heroImage from "../assets/hero.jpg";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-gray-700/50"></div>
      
      <Image
        src={heroImage}
        alt="Salon"
        layout="fill"
        objectFit="cover"
        quality={90}
        priority
      />

      <div className="text-center relative z-10">
        <h1 className="text-5xl font-bold">Realce sua Beleza</h1>
        <p className="mt-4 text-lg">Agende seu horário e tenha uma experiência incrível!</p>
        
        {/* Botão de CTA */}
        <button className="mt-6 bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-lg text-white font-semibold transition">
          Agendar Agora
        </button>
      </div>
    </section>
  );
};

export default Hero;
