// pages/portfolio.js
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import { motion } from 'framer-motion'
import 'react-photo-view/dist/react-photo-view.css'
import Navbar from '../components/Navbar'


export default function Portfolio() {
  const [fotos, setFotos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [filtro, setFiltro] = useState('')
  const [loading, setLoading] = useState(true)

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
    <div className="min-h-screen bg-neutral-900 text-white px-6 py-10">
        <Navbar />
      <h1 className="text-4xl font-bold text-center mb-8">Portfolio Fotográfico</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        <button
          onClick={() => setFiltro('')}
          className={`px-4 py-2 rounded border ${
            filtro === '' ? 'bg-white text-black' : 'border-white'
          }`}
        >
          Todas
        </button>
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFiltro(cat.id)}
            className={`px-4 py-2 rounded border ${
              filtro === cat.id ? 'bg-white text-black' : 'border-white'
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center">Cargando fotos...</p>
      ) : fotosFiltradas.length === 0 ? (
        <p className="text-center">No hay fotos para mostrar.</p>
      ) : (
        <PhotoProvider>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {fotosFiltradas.map((foto) => (
              <motion.div
                key={foto.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <PhotoView src={foto.url}>
                  <img
                    src={foto.url}
                    alt={foto.nombre}
                    className="w-full h-[400px] object-cover rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition"
                  />
                </PhotoView>
              </motion.div>
            ))}
          </div>
        </PhotoProvider>
      )}
    </div>
  )
}
