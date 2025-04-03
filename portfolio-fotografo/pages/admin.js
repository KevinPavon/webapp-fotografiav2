// pages/admin.js
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import useUser from '../lib/useUser'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import UploadForm from '../components/UploadForm'
import AdminGallery from '../components/AdminGallery'
import CategoriaForm from '../components/CategoriaForm'
import CategoriaTable from '../components/CategoriaTable'
import PerfilForm from '../components/PerfilForm'



// ...dentro del return



export default function Admin() {
  const router = useRouter()
  const { user, loading } = useUser()
  const [tab, setTab] = useState('perfil')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const galleryRef = useRef()
  const categoriaTableRef = useRef()

  if (loading) return <p>Cargando...</p>
  if (!user) return null

  return (
    <div className="min-h-screen bg-gradiente-rosa text-black font-serif p-8">
      <div className="max-w-5xl mx-auto bg-black bg-opacity-80 rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-4xl font-bold text-rosa-oscuro">Panel del Fotógrafo</h1>
        <p className="text-lg text-rosa-oscuro">
          Sesión iniciada como: <span className="font-semibold">{user.email}</span>
        </p>
  
        <button
          onClick={handleLogout}
          className="btn-negro bg-rosa-oscuro hover:bg-rosa-medio text-white px-4 py-2 rounded transition-all duration-300"
        >
          Cerrar sesión
        </button>
  
        {/* Tabs de navegación */}
        <div className="flex gap-4 mt-6 border-b border-white pb-2 text-white">
          <button
            onClick={() => setTab('perfil')}
            className={`px-4 py-2 rounded-t-md font-semibold ${
              tab === 'perfil' ? 'bg-rosa-medio text-black' : 'hover:bg-rosa-medio'
            }`}
          >
            Perfil
          </button>
          <button
            onClick={() => setTab('categorias')}
            className={`px-4 py-2 rounded-t-md font-semibold ${
              tab === 'categorias' ? 'bg-rosa-medio text-black' : 'hover:bg-rosa-medio'
            }`}
          >
            Categorías
          </button>
          <button
            onClick={() => setTab('fotos')}
            className={`px-4 py-2 rounded-t-md font-semibold ${
              tab === 'fotos' ? 'bg-rosa-medio text-black' : 'hover:bg-rosa-medio'
            }`}
          >
            Fotografías
          </button>
        </div>
  
        {/* Contenido de cada tab */}
        {tab === 'perfil' && <PerfilForm />}
  
        {tab === 'categorias' && (
          <>
            <CategoriaForm onCategoriaCreada={() => categoriaTableRef.current?.refresh()} />
            <CategoriaTable ref={categoriaTableRef} />
          </>
        )}
  
        {tab === 'fotos' && (
          <>
            <UploadForm onUploadSuccess={() => galleryRef.current?.refresh()} />
            <AdminGallery ref={galleryRef} />
          </>
        )}
      </div>
    </div>
  )
  
}
