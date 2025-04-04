// pages/portfolio.js
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Image from 'next/image'
import 'react-photo-view/dist/react-photo-view.css'
import Navbar from '../components/Navbar'
import { NextSeo } from 'next-seo'


export default function Portfolio() {
  const [fotos, setFotos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [filtro, setFiltro] = useState('')
  const [loading, setLoading] = useState(true)
  const [paginaActual, setPaginaActual] = useState(1)
  const fotosPorPagina = 9

  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: allFotos } = await supabase
        .from('fotos')
        .select('*')
        .order('created_at', { ascending: false })
      const { data: allCategorias } = await supabase
        .from('categorias')
        .select('*')
        .order('nombre')

      setFotos(allFotos)
      setCategorias(allCategorias)
      setLoading(false)
    }

    fetchData()
  }, [])

  const fotosFiltradas = filtro
    ? fotos.filter((f) => f.categoria_id === filtro)
    : fotos

  const indiceUltimaFoto = paginaActual * fotosPorPagina
  const indicePrimeraFoto = indiceUltimaFoto - fotosPorPagina
  const fotosActuales = fotosFiltradas.slice(indicePrimeraFoto, indiceUltimaFoto)

  const totalPaginas = Math.ceil(fotosFiltradas.length / fotosPorPagina)

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    
    <div className="min-h-screen bg-gradient-to-b from-black via-[#1a1a1a] to-rosa-claro text-white px-6 py-10 font-serif">
      <NextSeo
        title="Portfolio Fotográfico - Irina Wetzel"
        description="Explorá el portfolio profesional de Irina Wetzel. Retratos, arte y naturaleza en imágenes únicas."
        canonical="https://irinawetzel.com/portfolio"
        openGraph={{
          title: "Portfolio Fotográfico - Irina Wetzel",
          description: "Explorá el portfolio profesional de Irina Wetzel. Retratos, arte y naturaleza en imágenes únicas.",
          url: "https://irinawetzel.com/portfolio",
          type: "website",
        }}
      />

      <Navbar />

      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-rosa-medio drop-shadow">
          Irina Wetzel
        </h1>
        <p className="text-lg text-gray-300 mt-2 tracking-wide">
          Fotografía Profesional
        </p>
      </div>

      {/* Filtros de categoría */}
      <div className="flex flex-wrap gap-3 justify-center mb-14">
        {[{ id: '', nombre: 'Todas' }, ...categorias].map((cat) => {
          const isActive = filtro === cat.id

          return (
            <button
              key={cat.id || 'todas'}
              onClick={() => { 
                setFiltro(cat.id); 
                setPaginaActual(1); 
              }}
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
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 border-4 border-t-4 border-[var(--rosa-medio)] border-t-white rounded-full animate-spin"></div>
        </div>
      ) : fotosActuales.length === 0 ? (
        <p className="text-center text-gray-400">No hay fotos para mostrar.</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {fotosActuales.map((foto) => {
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
                  <Image
                    src={foto.url}
                    alt={foto.nombre}
                    width={600}
                    height={400}
                    className="w-full h-[400px] object-cover transition duration-300"
                    loading="lazy"
                    unoptimized
                    placeholder="blur" // 👈 blur activado
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP8////fwAJ/wP+vnnNAAAAAElFTkSuQmCC" // 👈 placeholder rosa suave
                  />

                  {/* Overlay rosa semitransparente */}
                  <div className="absolute inset-0 bg-rosa-medio bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <span className="text-white text-xl font-semibold tracking-wide drop-shadow-lg">
                      {categoria}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex justify-center mt-12 gap-6">
              <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  paginaActual === 1
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-[var(--rosa-medio)] hover:text-black'
                }`}
              >
                ◀ 
              </button>
              <button
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  paginaActual === totalPaginas
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-[var(--rosa-medio)] hover:text-black'
                }`}
              >
                 ▶
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
