// pages/fotografo.js
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

export default function Fotografo() {
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchPerfil = async () => {
    const { data } = await supabase.from('perfil').select('*').single()
    setPerfil(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchPerfil()
  }, [])

  return (
    <div className="min-h-screen bg-neutral-900 text-white px-6 py-10">
      <Navbar />
      <div className="max-w-4xl mx-auto text-center mt-10">
        {loading ? (
          <p className="text-gray-400">Cargando perfil...</p>
        ) : perfil ? (
          <>
            {perfil.foto_url && (
              <img
                src={perfil.foto_url}
                alt="Foto del fotógrafo"
                className="w-40 h-40 mx-auto mb-6 rounded-full object-cover shadow-lg"
              />
            )}
            <h1 className="text-4xl font-bold mb-2">{perfil.nombre}</h1>
            <p className="text-sm text-gray-400 mb-6">
              {perfil.descripcion}
            </p>

            <div className="text-sm text-gray-300">
              {perfil.email && (
                <p>
                  Email:{' '}
                  <a
                    href={`mailto:${perfil.email}`}
                    className="underline"
                  >
                    {perfil.email}
                  </a>
                </p>
              )}
              {perfil.instagram && (
                <p>
                  Instagram:{' '}
                  <a
                    href={perfil.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {perfil.instagram}
                  </a>
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="text-gray-400">Perfil no encontrado.</p>
        )}
      </div>
    </div>
  )
}
