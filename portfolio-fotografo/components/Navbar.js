import Link from 'next/link'
import { FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa'

export default function Navbar() {
  return (
    <nav className="bg-black bg-opacity-80 text-white px-6 py-4 shadow-lg sticky top-0 z-50 font-serif">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/portfolio" className="text-3xl font-bold text-rosa-medio hover:text-white transition-all">
          📷 Inicio
        </Link>

        {/* Navegación */}
        <div className="flex items-center gap-6 text-sm sm:text-base">
          <Link href="/portfolio" className="hover:text-rosa-medio transition-all">
            Galería
          </Link>
          <Link href="/fotografo" className="hover:text-rosa-medio transition-all">
            Sobre mí
          </Link>
          <Link href="/contacto" className="hover:text-rosa-medio transition-all">
            Contacto
          </Link>

          {/* Íconos redes sociales */}
          <div className="flex gap-4 ml-4">
            <a
              href="https://www.instagram.com/iwetzel/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-rosa-medio transition-all text-xl"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/in/irina-wetzel-marketingdigital/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-rosa-medio transition-all text-xl"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://wa.me/5493442518674"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-rosa-medio transition-all text-xl"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
