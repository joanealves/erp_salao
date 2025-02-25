import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-between items-center bg-white shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">Salon Manager</h1>
        <nav>
          <ul className="flex gap-6">
            <li>
              <a href="#services" className="text-gray-600 hover:text-gray-900">Serviços</a>
            </li>
            <li>
              <a href="#booking" className="text-gray-600 hover:text-gray-900">Agendar</a>
            </li>
            <li>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">Contato</a>
            </li>
          </ul>
        </nav>
      </header>
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6">
        <h2 className="text-5xl font-extrabold text-gray-800 max-w-2xl">
          Realce sua beleza com nossos serviços profissionais
        </h2>
        <p className="text-lg text-gray-600 mt-4 max-w-xl">
          Agende seu horário online e desfrute de uma experiência única em nosso salão.
        </p>
        <Button className="mt-6 px-6 py-3 text-lg" size="lg">
          Agendar Agora
        </Button>
      </section>
    </div>
  );
}
