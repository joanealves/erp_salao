import Image from "next/image";
import corteImage from "../assets/corte.jpg";
import coloracaoImage from "../assets/coloracao.jpg";
import hidratationImage from "../assets/hidratation.jpg";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";

const Services = () => {
  const services = [
    {
      name: "Corte de Cabelo",
      description: "Profissionais experientes para um corte perfeito que valoriza seu estilo pessoal.",
      details: "Inclui análise personalizada do formato do rosto, escolha do estilo ideal e finalização profissional.",
      image: corteImage,
      alt: "Serviço de corte de cabelo"
    },
    {
      name: "Coloração",
      description: "Tinturas de alta qualidade para um visual incrível e duradouro.",
      details: "Usamos produtos premium para garantir cores vibrantes e durabilidade prolongada.",
      image: coloracaoImage,
      alt: "Serviço de coloração de cabelo"
    },
    {
      name: "Hidratação",
      description: "Tratamentos profundos para manter seu cabelo saudável, brilhante e revitalizado.",
      details: "Tratamento intensivo com ingredientes naturais para restaurar a saúde dos fios.",
      image: hidratationImage,
      alt: "Serviço de hidratação capilar"
    }
  ];

  const packages = [
    {
      name: "Pacote Básico",
      price: "R$ 150",
      description: "Ideal para quem busca cuidados essenciais.",
      services: ["Corte de Cabelo", "Hidratação"]
    },
    {
      name: "Pacote Premium",
      price: "R$ 300",
      description: "Perfeito para quem deseja um tratamento completo.",
      services: ["Corte de Cabelo", "Coloração", "Hidratação"]
    },
    {
      name: "Pacote VIP",
      price: "R$ 500",
      description: "Experiência exclusiva com serviços premium.",
      services: ["Corte de Cabelo", "Coloração", "Hidratação", "Finalização Profissional"]
    }
  ];

  return (
    <section id="services" className="py-16 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Cabeçalho da seção */}
        <div className="text-center mb-12">
          <h2 className="text-3xl text-white md:text-4xl font-bold mb-4 relative inline-block">
            Nossos Serviços
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-green-500 rounded-full"></span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto mt-4">
            Conheça os tratamentos exclusivos que oferecemos para realçar sua beleza natural
          </p>
        </div>

        {/* Cards de serviços */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Dialog key={index}>
              <Card className="bg-gray-800 border border-gray-700 hover:border-green-500 transition-all duration-300">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                </div>

                {/* Conteúdo do card */}
                <CardHeader>
                  <CardTitle className="text-green-400">{service.name}</CardTitle>
                  <CardDescription className="text-gray-400">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <DialogTrigger asChild>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 w-full" aria-label="Botão para ver detalhes dos serviços">
                      Ver detalhes
                    </button>
                  </DialogTrigger>
                </CardContent>
              </Card>

              {/* Modal de detalhes */}
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{service.name}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <p className="text-sm text-gray-400">{service.details}</p>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* Seção de destaque para pacotes */}
        <Dialog>
          <div className="mt-16 bg-gradient-to-r from-green-900 to-green-800 rounded-xl p-8 text-center shadow-xl">
            <h3 className="text-2xl  text-slate-100 font-bold mb-4">Pacotes Especiais</h3>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              Economize com nossos pacotes exclusivos que combinam diferentes serviços para uma experiência completa de beleza.
            </p>
            <DialogTrigger asChild>
              <button className="px-6 py-3 bg-white text-green-800 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-md" aria-label="Botão para conhecer os pacotes de serviços">
                Conheça nossos pacotes
              </button>
            </DialogTrigger>
          </div>

          {/* Modal de pacotes */}
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Pacotes Especiais</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Accordion type="single" collapsible className="w-full">
                {packages.map((pkg, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-green-400 hover:text-green-500">
                      {pkg.name} - {pkg.price}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      <p>{pkg.description}</p>
                      <ul className="list-disc pl-6 mt-2">
                        {pkg.services.map((service, idx) => (
                          <li key={idx}>{service}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Services;