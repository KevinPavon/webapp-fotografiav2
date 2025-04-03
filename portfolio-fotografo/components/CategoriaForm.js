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
      <div className="mb-6 bg-[#111] p-4 rounded shadow text-white font-serif">
        <h2 className="text-lg font-semibold mb-2">Crear nueva categoría</h2>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Retrato, Naturaleza..."
            className="flex-grow p-2 rounded border border-white bg-black text-white"
          />
          <button type="submit" className="btn-negro">
            Crear
          </button>
        </form>
      </div>
    )
  }
  