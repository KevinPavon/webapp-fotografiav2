// components/UploadForm.js
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '../lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export default function UploadForm({ onUpload }) {
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
  }, [categoriaSeleccionada, onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div className="mb-4">
      <label className="block mb-2 text-white">Seleccioná una categoría</label>
      <select
        value={categoriaSeleccionada}
        onChange={(e) => setCategoriaSeleccionada(e.target.value)}
        className="mb-4 p-2 rounded text-black w-full"
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
        className={`border-2 border-dashed p-10 text-center rounded cursor-pointer ${
          isDragActive ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
        }`}
      >
        <input {...getInputProps()} />
        Arrastrá una imagen aquí o hacé clic para subir
      </div>
    </div>
  )
}
