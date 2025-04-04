// pages/categoria/[id].js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/Navbar'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { motion } from 'framer-motion'

export default function Categoria() {
  const router = useRouter()
  const { id } = router.query

  const [fotos, setFotos] = useState([])
  const [nombreCategoria, setNombreCategoria] = useState('')
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 font-serif">
      <Navbar />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-rosa-medio mb-10">
          Categoría: {nombreCategoria}
        </h1>

        {loading ? (
          <p className="text-center text-gray-400">Cargando imágenes...</p>
        ) : fotos.length === 0 ? (
          <p className="text-center text-gray-400">No hay fotos en esta categoría.</p>
        ) : (
          <PhotoProvider>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {fotos.map((foto) => (
                <motion.div
                  key={foto.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden rounded-xl shadow-xl border border-white"
                >
                  <PhotoView src={foto.url}>
                    <img
                      src={foto.url}
                      alt={foto.nombre}
                      className="w-full h-[400px] object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                    />
                  </PhotoView>
                </motion.div>
              ))}
            </div>
          </PhotoProvider>
        )}
      </div>
    </div>
  )
}
