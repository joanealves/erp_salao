import { Star, Award, Users, Sparkles } from "lucide-react";
import Image from "next/image";
import salon from "../assets/salon.jpg";

const AboutUs = () => {
  return (
    <section id="about" className="py-16 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Cabeçalho da seção */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
            Sobre Nós
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-green-500 rounded-full"></span>
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto mt-4">
            Conheça nossa história e descubra por que somos referência em beleza e bem-estar
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Nossa História</h3>
            <p className="text-gray-600 mb-4">
              Fundado em 2010, o Salon Beauty nasceu da paixão pela beleza e do desejo de proporcionar 
              experiências transformadoras. Começamos como um pequeno espaço e, com dedicação e 
              atendimento excepcional, nos tornamos referência no mercado.
            </p>
            <p className="text-gray-600 mb-6">
              Ao longo dos anos, investimos constantemente em treinamento, tecnologias e produtos de alta 
              qualidade para oferecer o melhor aos nossos clientes. Nossa missão é realçar a beleza natural 
              de cada pessoa, respeitando sua individualidade e promovendo bem-estar.
            </p>
            
            <div className="flex items-center">
              <div className="flex -space-x-4 mr-4">
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold border-2 border-white">M</div>
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold border-2 border-white">C</div>
                <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold border-2 border-white">J</div>
              </div>
              <p className="text-gray-600 italic">Nossa equipe de fundadores</p>
            </div>
          </div>
          
          <div className="relative order-1 md:order-2">
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-xl">
              <div className="relative w-full h-full bg-gray-300 flex items-center justify-center">
                              <p className="text-gray-500">Imagem do Salão</p>
                Se estiver usando Next.js:
                <Image 
                  src={salon} 
                  alt="Interior do nosso salão"
                  fill
                  className="object-cover"
                />
               
              </div>
            </div>
            
            {/* Decoração */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
              <p className="text-green-600 font-bold">13+ anos</p>
              <p className="text-gray-600 text-sm">de experiência</p>
            </div>
          </div>
        </div>
        
        {/* Nossos valores */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-10">Nossos Valores</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="bg-green-50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Star className="text-green-600" size={24} />
              </div>
              <h4 className="text-xl font-semibold mb-2">Excelência</h4>
              <p className="text-gray-600">
                Buscamos a perfeição em cada detalhe, usando técnicas avançadas e produtos de primeira linha para resultados impecáveis.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="bg-green-50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Users className="text-green-600" size={24} />
              </div>
              <h4 className="text-xl font-semibold mb-2">Personalização</h4>
              <p className="text-gray-600">
                Cada cliente é único. Desenvolvemos tratamentos personalizados que respeitam as características e necessidades individuais.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="bg-green-50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="text-green-600" size={24} />
              </div>
              <h4 className="text-xl font-semibold mb-2">Inovação</h4>
              <p className="text-gray-600">
                Estamos sempre atualizados com as últimas tendências e tecnologias para oferecer serviços de vanguarda no mercado.
              </p>
            </div>
          </div>
        </div>
        
        {/* Diferenciais */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-semibold mb-4">Por que escolher o Salon Beauty?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nosso compromisso vai além da beleza. Oferecemos uma experiência completa de bem-estar e cuidados personalizados.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <Award className="text-green-600" size={24} />
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Profissionais Certificados</h4>
                <p className="text-gray-600">
                  Nossa equipe é formada por profissionais com certificações nacionais e internacionais, constantemente atualizados.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <Award className="text-green-600" size={24} />
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Produtos Premium</h4>
                <p className="text-gray-600">
                  Trabalhamos apenas com as melhores marcas do mercado, garantindo resultados superiores e segurança.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <Award className="text-green-600" size={24} />
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Ambiente Exclusivo</h4>
                <p className="text-gray-600">
                  Espaço planejado para proporcionar conforto e privacidade, com música ambiente e aromaterapia.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <Award className="text-green-600" size={24} />
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Garantia de Satisfação</h4>
                <p className="text-gray-600">
                  Seu contentamento é nossa prioridade. Trabalhamos para superar suas expectativas em cada visita.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;