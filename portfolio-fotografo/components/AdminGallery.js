// components/AdminGallery.js
import {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle
} from 'react'
import { supabase } from '../lib/supabase'

const AdminGallery = forwardRef((props, ref) => {
  const [fotos, setFotos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [editandoId, setEditandoId] = useState(null)
  const [formData, setFormData] = useState({ nombre: '', categoria_id: '' })

  const fetchFotos = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('fotos')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) setFotos(data)
    setLoading(false)
  }

  const fetchCategorias = async () => {
    const { data } = await supabase.from('categorias').select('*').order('nombre')
    if (data) setCategorias(data)
  }

  const startEdit = (foto) => {
    setEditandoId(foto.id)
    setFormData({ nombre: foto.nombre, categoria_id: foto.categoria_id || '' })
  }

  const cancelEdit = () => {
    setEditandoId(null)
    setFormData({ nombre: '', categoria_id: '' })
  }

  const saveEdit = async (foto) => {
    const { error } = await supabase
      .from('fotos')
      .update({
        nombre: formData.nombre,
        categoria_id: formData.categoria_id || null
      })
      .eq('id', foto.id)

    if (!error) {
      await fetchFotos()
      cancelEdit()
    }
  }

  const handleDelete = async (foto) => {
    if (!confirm(`¿Eliminar "${foto.nombre}"?`)) return

    const fileName = foto.url.split('/').pop()
    const { error: storageError } = await supabase.storage
      .from('fotos')
      .remove([fileName])

    if (storageError) {
      console.error('Error al eliminar del storage:', storageError)
      return
    }

    const { error: dbError } = await supabase
      .from('fotos')
      .delete()
      .eq('id', foto.id)

    if (dbError) {
      console.error('Error al eliminar de la base de datos:', dbError)
      return
    }

    setFotos((prev) => prev.filter((f) => f.id !== foto.id))
  }

  useEffect(() => {
    fetchFotos()
    fetchCategorias()
  }, [])

  useImperativeHandle(ref, () => ({
    refresh: fetchFotos
  }))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
      {loading ? (
        <p className="col-span-full">Cargando imágenes...</p>
      ) : fotos.length === 0 ? (
        <p className="col-span-full">Aún no hay imágenes subidas.</p>
      ) : (
        fotos.map((foto) => {
          const categoriaNombre =
            categorias.find((c) => c.id === foto.categoria_id)?.nombre || 'Sin categoría'

          return (
            <div key={foto.id} className="bg-white rounded shadow p-4 relative text-black">
              <img
                src={foto.url}
                alt={foto.nombre}
                className="w-full h-60 object-cover rounded mb-2"
              />
              {editandoId === foto.id ? (
                <>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className="w-full mb-2 p-2 border rounded"
                  />
                  <select
                    value={formData.categoria_id}
                    onChange={(e) =>
                      setFormData({ ...formData, categoria_id: e.target.value })
                    }
                    className="w-full mb-2 p-2 border rounded"
                  >
                    <option value="">Sin categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(foto)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-500 text-white px-3 py-1 rounded"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium mb-1 truncate">{foto.nombre}</p>
                  <p className="text-xs text-gray-600 mb-3">{categoriaNombre}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(foto)}
                      className="bg-blue-600 text-white px-3 py-1 text-sm rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(foto)}
                      className="bg-red-600 text-white px-3 py-1 text-sm rounded"
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        })
      )}
    </div>
  )
})

export default AdminGallery
