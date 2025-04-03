// components/PerfilForm.js
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function PerfilForm() {
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    email: '',
    instagram: '',
    foto_url: ''
  })

  const fetchPerfil = async () => {
    const { data } = await supabase.from('perfil').select('*').single()
    if (data) {
      setPerfil(data)
      setFormData(data)
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const fileName = `perfil_${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('fotos')
      .upload(fileName, file, { upsert: true })

    if (!uploadError) {
      const { data } = supabase.storage.from('fotos').getPublicUrl(fileName)
      setFormData({ ...formData, foto_url: data.publicUrl })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (perfil) {
      await supabase
        .from('perfil')
        .update(formData)
        .eq('id', perfil.id)
    } else {
      await supabase.from('perfil').insert(formData)
    }

    alert('Perfil guardado con éxito.')
    fetchPerfil()
  }

  useEffect(() => {
    fetchPerfil()
  }, [])

  return (
    <div className="bg-white rounded shadow p-6 mb-8 text-black">
      <h2 className="text-lg font-semibold mb-4">Editar perfil del fotógrafo</h2>
      {loading ? (
        <p>Cargando perfil...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full p-2 border rounded"
          />
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
            className="w-full p-2 border rounded"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
          <input
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            placeholder="Instagram"
            className="w-full p-2 border rounded"
          />
          <div>
            <label className="block mb-1">Foto de perfil</label>
            <input type="file" accept="image/*" onChange={handleFotoUpload} />
            {formData.foto_url && (
              <img
                src={formData.foto_url}
                alt="Foto perfil"
                className="w-32 h-32 object-cover rounded-full mt-2"
              />
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Guardar perfil
          </button>
        </form>
      )}
    </div>
  )
}
