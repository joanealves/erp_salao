import Image from "next/image";
import corteImage from "../assets/corte.jpg";
import coloracaoImage from "../assets/coloracao.jpg";
import hidratationImage from "../assets/hidratation.jpg";

const Services = () => {
  const services = [
    {
      name: "Corte de Cabelo",
      description: "Profissionais experientes para um corte perfeito que valoriza seu estilo pessoal.",
      image: corteImage,
      alt: "Serviço de corte de cabelo"
    },
    {
      name: "Coloração",
      description: "Tinturas de alta qualidade para um visual incrível e duradouro.",
      image: coloracaoImage,
      alt: "Serviço de coloração de cabelo"
    },
    {
      name: "Hidratação",
      description: "Tratamentos profundos para manter seu cabelo saudável, brilhante e revitalizado.",
      image: hidratationImage,
      alt: "Serviço de hidratação capilar"
    }
  ];

  return (
    <section id="services" className="py-16 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Cabeçalho da seção */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
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
            <div 
              key={index}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl group"
            >
              {/* Imagem do serviço */}
              <div className="relative h-56 w-full overflow-hidden">
                <Image 
                  src={service.image}
                  alt={service.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
              </div>
              
              {/* Conteúdo do card */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-green-400">{service.name}</h3>
                <p className="text-gray-300">{service.description}</p>
                
                <div className="mt-6 flex justify-between items-center">
                  <span className="text-sm text-gray-400">A partir de</span>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300">
                    Ver detalhes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Seção de destaque para pacotes */}
        <div className="mt-16 bg-gradient-to-r from-green-900 to-green-800 rounded-xl p-8 text-center shadow-xl">
          <h3 className="text-2xl font-bold mb-4">Pacotes Especiais</h3>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            Economize com nossos pacotes exclusivos que combinam diferentes serviços para uma experiência completa de beleza.
          </p>
          <button className="px-6 py-3 bg-white text-green-800 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-md">
            Conheça nossos pacotes
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;