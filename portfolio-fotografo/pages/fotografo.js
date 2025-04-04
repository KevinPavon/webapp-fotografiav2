// pages/fotografo.js
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { NextSeo } from 'next-seo'


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
    <div className="min-h-screen bg-black text-white px-6 py-10 font-serif">
      <NextSeo
        title="Sobre mí - Irina Wetzel"
        description="Conocé a Irina Wetzel, fotógrafa profesional especializada en capturar emociones y momentos inolvidables."
        canonical="https://irinawetzel.com/fotografo"
        openGraph={{
          title: "Sobre mí - Irina Wetzel",
          description: "Conocé a Irina Wetzel, fotógrafa profesional especializada en capturar emociones y momentos inolvidables.",
          url: "https://irinawetzel.com/fotografo",
          type: "profile",
        }}
      />

      <Navbar />
      <div className="max-w-4xl mx-auto text-center mt-10 bg-[#111] bg-opacity-90 p-10 rounded-xl shadow-lg">
        {loading ? (
          <p className="text-gray-400">Cargando perfil...</p>
        ) : perfil ? (
          <>
            {perfil.foto_url && (
              <img
                src={perfil.foto_url}
                alt="Foto del fotógrafo"
                className="w-40 h-40 mx-auto mb-6 rounded-full object-cover border-2 border-white shadow-md"
              />
            )}
            <h1 className="text-4xl font-bold mb-2 text-rosa-claro">{perfil.nombre}</h1>
            <p className="text-sm text-gray-300 mb-6 italic">{perfil.descripcion}</p>
  
            <div className="text-sm text-gray-300 space-y-1">
              {perfil.email && (
                <p>
                  Email:{' '}
                  <a
                    href={`mailto:${perfil.email}`}
                    className="underline hover:text-rosa-medio"
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
                    className="underline hover:text-rosa-medio"
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
