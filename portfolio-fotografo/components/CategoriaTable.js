import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { supabase } from '../lib/supabase'

const CategoriaTable = forwardRef((props, ref) => {
  const [categorias, setCategorias] = useState([])
  const [editando, setEditando] = useState(null)
  const [nuevoNombre, setNuevoNombre] = useState('')

  const fetchCategorias = async () => {
    const { data } = await supabase.from('categorias').select('*').order('nombre')
    setCategorias(data || [])
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
    if (!error) fetchCategorias()
  }

  useEffect(() => {
    fetchCategorias()
  }, [])

  useImperativeHandle(ref, () => ({
    refresh: fetchCategorias
  }))

  return (
    <div className="bg-[#111] border border-white p-4 text-white mb-6 font-serif">
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
            <tr key={cat.id} className="border-t border-white/20">
              <td className="py-2">
                {editando === cat.id ? (
                  <input
                    type="text"
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    className="border border-white bg-black text-white px-2 py-1 w-full"
                  />
                ) : (
                  cat.nombre
                )}
              </td>

              <td className="py-2 space-x-2">
                {editando === cat.id ? (
                  <button onClick={() => handleSave(cat.id)} className="btn-negro" title="Guardar">
                    💾
                  </button>
                ) : (
                  <button onClick={() => handleEdit(cat)} className="btn-negro" title="Editar">
                    ✏️
                  </button>
                )}

                <button onClick={() => handleDelete(cat.id)} className="btn-negro" title="Eliminar">
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

CategoriaTable.displayName = 'CategoriaTable'
export default CategoriaTable
