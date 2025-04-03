import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { supabase } from '../lib/supabase'

const CategoriaTable = forwardRef((props, ref) => {
  const [categorias, setCategorias] = useState([])
  const [editando, setEditando] = useState(null)
  const [nuevoNombre, setNuevoNombre] = useState('')

  const fetchCategorias = async () => {
    const { data } = await supabase.from('categorias').select('*').order('nombre')
    setCategorias(data)
  }

  const handleEdit = (cat) => {
    setEditando(cat.id)
    setNuevoNombre(cat.nombre)
  }

  const handleSave = async (id) => {
    if (!nuevoNombre.trim()) return

    const { error } = await supabase
      .from('categorias')
      .update({ nombre: nuevoNombre })
      .eq('id', id)

    if (!error) {
      setEditando(null)
      setNuevoNombre('')
      fetchCategorias()
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que querés eliminar esta categoría?')) return

    const { error } = await supabase.from('categorias').delete().eq('id', id)
    if (!error) {
      fetchCategorias()
    }
  }

  useEffect(() => {
    fetchCategorias()
  }, [])

  // Exponer método al padre
  useImperativeHandle(ref, () => ({
    refresh: fetchCategorias
  }))

  return (
    <div className="bg-white rounded shadow p-4 text-black mb-6">
      <h2 className="text-lg font-semibold mb-4">Categorías existentes</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="pb-2">Nombre</th>
            <th className="pb-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((cat) => (
            <tr key={cat.id}>
              <td className="py-2">
                {editando === cat.id ? (
                  <input
                    type="text"
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                  />
                ) : (
                  cat.nombre
                )}
              </td>
              <td className="py-2 space-x-2">
                {editando === cat.id ? (
                  <button
                    onClick={() => handleSave(cat.id)}
                    className="bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Guardar
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(cat)}
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    Editar
                  </button>
                )}
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

export default CategoriaTable
