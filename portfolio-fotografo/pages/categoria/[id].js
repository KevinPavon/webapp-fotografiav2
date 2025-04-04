// pages/categoria/[id].js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/Navbar'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { NextSeo } from 'next-seo'


export default function Categoria() {
  const router = useRouter()
  const { id } = router.query

  const [fotos, setFotos] = useState([])
  const [nombreCategoria, setNombreCategoria] = useState('')
  const [loading, setLoading] = useState(true)
  const [paginaActual, setPaginaActual] = useState(1)
  const fotosPorPagina = 9

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      setLoading(true)

      const { data: categoria } = await supabase
        .from('categorias')
        .select('*')
        .eq('id', id)
        .single()

      const { data: fotosData } = await supabase
        .from('fotos')
        .select('*')
        .eq('categoria_id', id)
        .order('created_at', { ascending: false })

      setNombreCategoria(categoria?.nombre || 'Sin nombre')
      setFotos(fotosData || [])
      setLoading(false)
    }

    fetchData()
  }, [id])

  const indiceUltimaFoto = paginaActual * fotosPorPagina
  const indicePrimeraFoto = indiceUltimaFoto - fotosPorPagina
  const fotosActuales = fotos.slice(indicePrimeraFoto, indiceUltimaFoto)

  const totalPaginas = Math.ceil(fotos.length / fotosPorPagina)

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 font-serif">
      <NextSeo
        title={`Categoría: ${nombreCategoria} - Irina Wetzel`}
        description={`Fotos dentro de la categoría ${nombreCategoria} en el portfolio de Irina Wetzel.`}
        canonical={`https://irinawetzel.com/categoria/${id}`}
        openGraph={{
          title: `Categoría: ${nombreCategoria} - Irina Wetzel`,
          description: `Fotos dentro de la categoría ${nombreCategoria} en el portfolio de Irina Wetzel.`,
          url: `https://irinawetzel.com/categoria/${id}`,
          type: "website",
        }}
      />

      <Navbar />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-rosa-medio mb-10">
          Categoría: {nombreCategoria}
        </h1>

        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-16 h-16 border-4 border-t-4 border-[var(--rosa-medio)] border-t-white rounded-full animate-spin"></div>
          </div>
        ) : fotos.length === 0 ? (
          <p className="text-center text-gray-400">No hay fotos disponibles en esta categoría.</p>
        ) : (
          <PhotoProvider>
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {fotosActuales.map((foto) => (
                  <motion.div
                    key={foto.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden rounded-xl shadow-xl border border-white cursor-pointer"
                  >
                    <PhotoView src={foto.url}>
                      <Image
                        src={foto.url}
                        alt={foto.nombre}
                        width={600}
                        height={400}
                        className="w-full h-[400px] object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        unoptimized
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP8////fwAJ/wP+vnnNAAAAAElFTkSuQmCC"
                      />
                    </PhotoView>
                  </motion.div>
                ))}
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
          </PhotoProvider>
        )}
      </div>
    </div>
  )
}
