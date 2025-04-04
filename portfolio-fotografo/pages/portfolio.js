// pages/portfolio.js
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import 'react-photo-view/dist/react-photo-view.css'
import Navbar from '../components/Navbar'


export default function Portfolio() {
  const [fotos, setFotos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [filtro, setFiltro] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: allFotos } = await supabase.from('fotos').select('*').order('created_at', { ascending: false })
      const { data: allCategorias } = await supabase.from('categorias').select('*').order('nombre')

      setFotos(allFotos)
      setCategorias(allCategorias)
      setLoading(false)
    }

    fetchData()
  }, [])

  const fotosFiltradas = filtro
    ? fotos.filter((f) => f.categoria_id === filtro)
    : fotos

    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-[#1a1a1a] to-rosa-claro text-white px-6 py-10 font-serif">
        <Navbar />
    
        <h1 className="text-5xl font-bold text-center mb-12 text-rosa-medio drop-shadow">
          Portfolio Fotográfico
        </h1>
    
        {/* Filtros de categoría */}
        <div className="flex flex-wrap gap-3 justify-center mb-14">
        {[{ id: '', nombre: 'Todas' }, ...categorias].map((cat) => {
          const isActive = filtro === cat.id

          return (
            <button
              key={cat.id || 'todas'}
              onClick={() => setFiltro(cat.id)}
              className={`group px-5 py-2 rounded-full border transition-all duration-300 text-sm sm:text-base
                ${isActive
                  ? 'font-semibold shadow text-black bg-[var(--rosa-medio)]'
                  : 'border-white text-white hover:bg-[var(--rosa-medio)] hover:text-black'}
              `}
            >
              {cat.nombre}
            </button>
          )
        })}
      </div>



    
        {/* Galería */}
        {loading ? (
          <p className="text-center text-gray-300">Cargando fotos...</p>
        ) : fotosFiltradas.length === 0 ? (
          <p className="text-center text-gray-400">No hay fotos para mostrar.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {fotosFiltradas.map((foto) => {
              const categoria =
                categorias.find((c) => c.id === foto.categoria_id)?.nombre || 'Sin categoría'
    
              return (
                <motion.div
                  key={foto.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => router.push(`/categoria/${foto.categoria_id}`)}
                  className="relative group rounded-xl overflow-hidden shadow-2xl cursor-pointer"
                >
                  <img
                    src={foto.url}
                    alt={foto.nombre}
                    className="w-full h-[400px] object-cover transition duration-300"
                  />
    
                  {/* Overlay rosa semitransparente con texto */}
                  <div className="absolute inset-0 bg-rosa-medio bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <span className="text-white text-xl font-semibold tracking-wide drop-shadow-lg">
                      {categoria}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    )      
}
