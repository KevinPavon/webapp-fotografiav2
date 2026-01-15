// components/UploadForm.js
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '../lib/supabase'
import { v4 as uuidv4 } from 'uuid'

async function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      const width = img.naturalWidth
      const height = img.naturalHeight
      URL.revokeObjectURL(url)
      resolve({ width, height })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer el tamaño de la imagen'))
    }

    img.src = url
  })
}

export default function UploadForm({ onUploadSuccess }) {
  const [categorias, setCategorias] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('')
  const [subiendo, setSubiendo] = useState(false)

  const fetchCategorias = async () => {
    const { data } = await supabase.from('categorias').select('*').order('nombre')
    setCategorias(data || [])
  }

  useEffect(() => {
    fetchCategorias()
  }, [])

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!acceptedFiles?.length) return
      setSubiendo(true)

      try {
        for (const file of acceptedFiles) {
          const filePath = `${uuidv4()}-${file.name}`

          // 1) Leer dimensiones ANTES de subir
          let dims = { width: null, height: null }
          try {
            dims = await getImageDimensions(file)
          } catch (e) {
            // No frenamos la subida si falla; solo no guardamos dims
            console.warn('No pude obtener dimensiones:', file.name, e?.message || e)
          }

          // 2) Subir a storage
          const { error: uploadError } = await supabase.storage
            .from('fotos')
            .upload(filePath, file)

          if (uploadError) {
            console.error('Error al subir', file.name, uploadError)
            continue
          }

          // 3) URL pública
          const { data } = supabase.storage.from('fotos').getPublicUrl(filePath)
          const publicUrl = data?.publicUrl

          // 4) Guardar en DB con width/height
          const { error: dbError } = await supabase.from('fotos').insert({
            nombre: file.name,
            url: publicUrl,
            categoria_id: categoriaSeleccionada || null,
            width: dims.width,
            height: dims.height,
          })

          if (dbError) {
            console.error('Error al guardar en base de datos:', dbError)
          } else {
            if (onUploadSuccess) onUploadSuccess()
          }
        }
      } finally {
        setSubiendo(false)
      }
    },
    [categoriaSeleccionada, onUploadSuccess]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  })

  return (
    <div className="mb-4">
      <label className="block mb-2 text-white font-serif">Seleccioná una categoría</label>

      <select
        value={categoriaSeleccionada}
        onChange={(e) => setCategoriaSeleccionada(e.target.value)}
        className="mb-4 p-2 bg-black text-white border border-white w-full font-serif"
        disabled={subiendo}
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
        className={`border-2 border-dashed p-10 text-center cursor-pointer font-serif ${
          isDragActive ? 'bg-[#161616] text-white' : 'bg-[#111] text-white'
        } ${subiendo ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} disabled={subiendo} />
        {subiendo ? 'Subiendo…' : 'Arrastrá una imagen aquí o hacé clic para subir'}
      </div>
    </div>
  )
}
