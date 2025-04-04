// components/Navbar.js
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-black bg-opacity-80 text-white px-6 py-4 shadow-lg sticky top-0 z-50 font-serif">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        {/* Título clickeable */}
        <Link href="/portfolio" className="text-3xl font-bold text-rosa-medio hover:underline transition">
          📷 Portfolio
        </Link>

        <div className="space-x-6 text-sm sm:text-base">
          <Link href="/portfolio" className="hover:text-rosa-medio transition">
            Galería
          </Link>
          <Link href="/fotografo" className="hover:text-rosa-medio transition">
            Sobre mí
          </Link>
        </div>
      </div>
    </nav>
  )
}
