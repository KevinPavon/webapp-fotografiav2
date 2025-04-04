// pages/admin.js
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import useUser from '../lib/useUser'
import { useEffect, useRef, useState } from 'react'
import UploadForm from '../components/UploadForm'
import AdminGallery from '../components/AdminGallery'
import CategoriaForm from '../components/CategoriaForm'
import CategoriaTable from '../components/CategoriaTable'
import PerfilForm from '../components/PerfilForm'
import VisitasPanel from '../components/VisitasPanel' 
import VisitasChart from '../components/VisitasChart'

export default function Admin() {
  const router = useRouter()
  const { user, loading } = useUser()
  const [tab, setTab] = useState('perfil')
  const [visitasData, setVisitasData] = useState([])
  const [labels, setLabels] = useState([])
  const [totalVisitas, setTotalVisitas] = useState(0)
  const [cargandoVisitas, setCargandoVisitas] = useState(true)

  const galleryRef = useRef()
  const categoriaTableRef = useRef()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchVisitas = async () => {
      try {
        const response = await fetch('/api/analytics/visitas')
        const data = await response.json()
  
        if (data && data.rows) {
          const labels = data.rows.map((row) => {
            const fecha = row.dimensionValues[0]?.value
            // Formato bonito: 20250404 -> 04/04
            return `${fecha.slice(6, 8)}/${fecha.slice(4, 6)}`
          })
          const visitas = data.rows.map((row) => parseInt(row.metricValues[0]?.value))
  
          setLabels(labels)
          setVisitasData(visitas)
          setTotalVisitas(visitas.reduce((acc, curr) => acc + curr, 0))
        }
      } catch (error) {
        console.error('Error obteniendo visitas', error)
      } finally {
        setCargandoVisitas(false)
      }
    }
  
    fetchVisitas()
  }, [])
  

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <p className="text-center text-white">Cargando...</p>
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
          <button
            onClick={() => setTab('visitas')}
            className={`px-4 py-2 rounded-t-md font-semibold ${
              tab === 'visitas' ? 'bg-rosa-medio text-black' : 'hover:bg-rosa-medio'
            }`}
          >
            Visitas
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

        {tab === 'visitas' && (
          cargandoVisitas ? (
            <div className="flex justify-center items-center min-h-[30vh]">
              <div className="w-12 h-12 border-4 border-[var(--rosa-medio)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <VisitasPanel total={totalVisitas} data={visitasData} labels={labels} />
            </>
          )
        )}
      </div>
    </div>
  )
}
