import Link from 'next/link'
import { FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa'
import { HiOutlineCamera } from 'react-icons/hi2'

export default function Navbar() {
  return (
    <nav className="bg-black bg-opacity-80 text-white px-6 py-4 sticky top-0 z-50 font-serif border-b border-white/20">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/portfolio" className="text-2xl sm:text-3xl font-bold text-rosa-medio flex items-center gap-2">
          <HiOutlineCamera className="text-2xl sm:text-3xl" />
          Inicio
        </Link>

        {/* Navegación */}
        <div className="flex items-center gap-6 text-sm sm:text-base">
          <Link href="/portfolio">
            Galería
          </Link>
          <Link href="/fotografo">
            Sobre mí
          </Link>
          <Link href="/contacto">
            Contacto
          </Link>

          {/* Íconos redes sociales */}
          <div className="flex gap-4 ml-4">
            <a
              href="https://www.instagram.com/fotografiawetzel/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-xl"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/in/irina-wetzel-marketingdigital/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-xl"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://wa.me/5493442518674"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-xl"
              aria-label="WhatsApp"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
