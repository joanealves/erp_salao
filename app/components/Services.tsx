import { FaCut, FaPalette, FaShower } from "react-icons/fa";

const Services = () => {
  return (
    <section id="services" className="py-16 bg-gray-800 text-white">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold">Nossos Serviços</h2>
        <p className="text-gray-400">Veja os serviços que oferecemos</p>
      </div>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 p-6 rounded-lg shadow-md text-center transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
          <div className="flex justify-center items-center h-16 mb-4">
            <FaCut size={40} className="text-green-500" />
          </div>
          <h3 className="text-xl font-semibold mt-4">Corte de Cabelo</h3>
          <p className="text-gray-400">Profissionais experientes para um corte perfeito.</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg shadow-md text-center transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
          <div className="flex justify-center items-center h-16 mb-4">
            <FaPalette size={40} className="text-green-500" />
          </div>
          <h3 className="text-xl font-semibold mt-4">Coloração</h3>
          <p className="text-gray-400">Tinturas de alta qualidade para um visual incrível.</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg shadow-md text-center transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
          <div className="flex justify-center items-center h-16 mb-4">
            <FaShower size={40} className="text-green-500" />
          </div>
          <h3 className="text-xl font-semibold mt-4">Hidratação</h3>
          <p className="text-gray-400">Tratamentos para manter seu cabelo saudável.</p>
        </div>
      </div>
    </section>
  );
};

export default Services;