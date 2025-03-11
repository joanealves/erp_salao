import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Twitter } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
        {/* Cabeçalho da seção */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
            Entre em Contato
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-green-500 rounded-full"></span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto mt-4">
            Estamos à disposição para esclarecer dúvidas, receber sugestões e agendar seu horário.
          </p>
        </div>

        {/* Cartões de contato */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Cartão de Telefone */}
          <div className="bg-gray-800 hover:bg-gray-700 rounded-xl p-6 text-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg border border-gray-700">
            <div className="bg-green-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Phone size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Telefone</h3>
            <p className="text-gray-400">(11) 99999-9999</p>
            <p className="text-gray-400 mt-1">Segunda a Sábado</p>
          </div>

          {/* Cartão de Email */}
          <div className="bg-gray-800 hover:bg-gray-700 rounded-xl p-6 text-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg border border-gray-700">
            <div className="bg-green-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Mail size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Email</h3>
            <p className="text-gray-400">contato@salon.com</p>
            <p className="text-gray-400 mt-1">Respondemos em até 24h</p>
          </div>

          {/* Cartão de Endereço */}
          <div className="bg-gray-800 hover:bg-gray-700 rounded-xl p-6 text-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg border border-gray-700">
            <div className="bg-green-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MapPin size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Endereço</h3>
            <p className="text-gray-400">Rua Exemplo, 123</p>
            <p className="text-gray-400 mt-1">São Paulo, SP</p>
          </div>
        </div>

        {/* Horários e Redes Sociais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Horários de Funcionamento */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <Clock size={24} className="text-green-500 mr-3" />
              <h3 className="text-xl font-semibold">Horário de Funcionamento</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Segunda - Sexta</span>
                <span>09:00 - 20:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sábado</span>
                <span>09:00 - 18:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Domingo</span>
                <span>Fechado</span>
              </div>
            </div>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Siga-nos nas Redes Sociais</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-green-600 p-3 rounded-full transition-colors duration-300">
                <Instagram size={24} />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-green-600 p-3 rounded-full transition-colors duration-300">
                <Facebook size={24} />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-green-600 p-3 rounded-full transition-colors duration-300">
                <Twitter size={24} />
              </a>
            </div>
            <p className="text-gray-400 mt-4">Acompanhe novidades, promoções e dicas</p>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-700 my-12"></div>

        {/* Rodapé */}
        <div className="text-center">
          <p className="text-gray-500">© {new Date().getFullYear()} Salon Beauty. Todos os direitos reservados.</p>
          <p className="text-gray-600 mt-2 text-sm">
            <a href="#" className="hover:text-green-500 transition-colors">Política de Privacidade</a> | 
            <a href="#" className="hover:text-green-500 transition-colors ml-2">Termos de Uso</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;