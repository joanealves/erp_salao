import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <section id="contact" className="py-16 bg-gray-100 text-center">
      <h2 className="text-4xl font-bold">Entre em Contato</h2>
      <p className="text-gray-600">Estamos à disposição para te atender!</p>
      <div className="flex justify-center mt-6 space-x-8">
        <div className="text-center">
          <FaPhone size={30} className="mx-auto text-pink-500" />
          <p>(11) 99999-9999</p>
        </div>
        <div className="text-center">
          <FaEnvelope size={30} className="mx-auto text-pink-500" />
          <p>contato@salon.com</p>
        </div>
        <div className="text-center">
          <FaMapMarkerAlt size={30} className="mx-auto text-pink-500" />
          <p>Rua Exemplo, 123</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
