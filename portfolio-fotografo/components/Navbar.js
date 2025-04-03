// components/Navbar.js
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-neutral-950 text-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">📷 Portfolio</h1>
        <div className="space-x-6 text-sm sm:text-base">
          <Link href="/portfolio" className="hover:underline">
            Galería
          </Link>
          <Link href="/fotografo" className="hover:underline">
            Sobre mí
          </Link>
        </div>
      </div>
    </nav>
  )
}
