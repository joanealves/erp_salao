"use client";

import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          Beauty Salon
        </Link>

        {/* Links Desktop */}
        <nav className="hidden md:flex space-x-6">
          <Link href="#services" className="hover:text-green-400">Serviços</Link>
          <Link href="#about" className="hover:text-green-400">Sobre</Link>
          <Link href="#contact" className="hover:text-green-400">Contato</Link>
        </nav>

        {/* Botão do menu mobile */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <FaBars size={24} />
        </button>
      </div>

      {/* Menu Mobile */}
      <div className={`fixed inset-0 bg-gray-900/90 flex flex-col items-center justify-center text-xl space-y-6 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out md:hidden`}>
        <button className="absolute top-6 right-6" onClick={() => setIsOpen(false)}>
          <FaTimes size={28} />
        </button>
        <Link href="#services" className="hover:text-green-400" onClick={() => setIsOpen(false)}>Serviços</Link>
        <Link href="#about" className="hover:text-green-400" onClick={() => setIsOpen(false)}>Sobre</Link>
        <Link href="#contact" className="hover:text-green-400" onClick={() => setIsOpen(false)}>Contato</Link>
      </div>
    </header>
  );
};

export default Header;