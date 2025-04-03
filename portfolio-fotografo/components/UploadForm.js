// components/UploadForm.js
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '../lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export default function UploadForm({ onUploadSuccess }) {
  const [categorias, setCategorias] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('')

  const fetchCategorias = async () => {
    const { data } = await supabase.from('categorias').select('*').order('nombre')
    setCategorias(data)
  }

  useEffect(() => {
    fetchCategorias()
  }, [])

  const onDrop = useCallback(async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      const filePath = `${uuidv4()}-${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('fotos')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Error al subir', file.name, uploadError)
        continue
      }

      const { data } = supabase.storage.from('fotos').getPublicUrl(filePath)
      const publicUrl = data.publicUrl

      const { error: dbError } = await supabase.from('fotos').insert({
        nombre: file.name,
        url: publicUrl,
        categoria_id: categoriaSeleccionada || null
      })

      if (dbError) {
        console.error('Error al guardar en base de datos:', dbError)
      } else {
        if (onUploadSuccess) onUploadSuccess()
      }
    }
  }, [categoriaSeleccionada, onUploadSuccess])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div className="mb-4">
      <label className="block mb-2 text-white font-serif">Seleccioná una categoría</label>
      <select
        value={categoriaSeleccionada}
        onChange={(e) => setCategoriaSeleccionada(e.target.value)}
        className="mb-4 p-2 rounded bg-rosa-medio text-black border border-white w-full font-serif shadow"
      >
        <option value="">Sin categoría</option>
        {categorias.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.nombre}
          </option>
        ))}
      </select>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded p-10 text-center cursor-pointer transition-colors duration-300 font-serif ${
          isDragActive ? 'bg-rosa-medio text-black' : 'bg-[#111] text-white'
        }`}
      >
        <input {...getInputProps()} />
        Arrastrá una imagen aquí o hacé clic para subir
      </div>
    </div>
  )
}
