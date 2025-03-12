"use client";

import { useState } from "react";
import { FaBars, FaTimes, FaLock } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/assets/logo.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full px-6 py-4 flex justify-between items-center bg-gray-900 text-white">
      {/* Logo e Nome */}
      <div className="flex items-center space-x-3">
        <Image src={Logo} alt="Logo" width={40} height={40} />
        <Link href="/" className="text-2xl font-bold text-white">
          Beauty Salon
        </Link>
      </div>

      {/* Links Desktop */}
      <nav className="hidden md:flex space-x-6">
        <Link href="#services" className="hover:text-green-400">Serviços</Link>
        <Link href="#about" className="hover:text-green-400">Sobre</Link>
        <Link href="#contact" className="hover:text-green-400">Contato</Link>
        <Link href="/admin" className="flex items-center space-x-1 text-green-400 hover:text-green-300">
          <FaLock size={14} />
          <span>Admin</span>
        </Link>
      </nav>

      {/* Botão do menu mobile */}
      <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
        <FaBars size={24} />
      </button>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900/90 flex flex-col items-center justify-center text-xl space-y-6 md:hidden text-white">
          <button className="absolute top-6 right-6 text-white" onClick={() => setIsOpen(false)}>
            <FaTimes size={28} />
          </button>
          <Link href="#services" className="hover:text-green-400" onClick={() => setIsOpen(false)}>Serviços</Link>
          <Link href="#about" className="hover:text-green-400" onClick={() => setIsOpen(false)}>Sobre</Link>
          <Link href="#contact" className="hover:text-green-400" onClick={() => setIsOpen(false)}>Contato</Link>
          <Link href="/admin" className="flex items-center space-x-1 text-green-400 hover:text-green-300" onClick={() => setIsOpen(false)}>
            <FaLock size={14} />
            <span>Admin</span>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;