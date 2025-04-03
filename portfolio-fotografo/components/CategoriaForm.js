import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function CategoriaForm({ onCategoriaCreada }) {
    const [nombre, setNombre] = useState('')
  
    const handleSubmit = async (e) => {
      e.preventDefault()
      if (!nombre) return
  
      await supabase.from('categorias').insert({ nombre })
      setNombre('')
  
      if (onCategoriaCreada) onCategoriaCreada() // 🔄 notifica al padre
    }
  
    return (
      <div className="mb-6 bg-white p-4 rounded shadow text-black">
        <h2 className="text-lg font-semibold mb-2">Crear nueva categoría</h2>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Retrato, Naturaleza..."
            className="flex-grow p-2 rounded border text-black"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Crear
          </button>
        </form>
      </div>
    )
  }
  