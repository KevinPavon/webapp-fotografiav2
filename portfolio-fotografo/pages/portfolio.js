// pages/portfolio.js
import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Navbar from '../components/Navbar'
import { NextSeo } from 'next-seo'

function useContainerWidth() {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current

    const ro = new ResizeObserver((entries) => {
      const w = entries?.[0]?.contentRect?.width || 0
      setWidth(Math.floor(w))
    })

    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return { ref, width }
}

function buildJustifiedRows(photos, containerWidth, targetRowHeight = 420, gap = 14) {
  if (!containerWidth) return []

  const rows = []
  let current = []
  let sumRatios = 0

  for (const p of photos) {
    const w = Number(p.width) || 0
    const h = Number(p.height) || 0
    const ratio = w > 0 && h > 0 ? w / h : 1.5

    current.push({ ...p, ratio })
    sumRatios += ratio

    const rowWidthAtTarget = sumRatios * targetRowHeight + gap * (current.length - 1)
    if (rowWidthAtTarget >= containerWidth) {
      const usable = (containerWidth - 2) - gap * (current.length - 1)
      const rowHeight = Math.max(240, Math.floor(usable / sumRatios))

      rows.push({
        height: rowHeight,
        items: current.map((it) => ({
          ...it,
          renderW: Math.floor(it.ratio * rowHeight),
          renderH: rowHeight,
        })),
      })

      current = []
      sumRatios = 0
    }
  }

  if (current.length) {
    rows.push({
      height: targetRowHeight,
      items: current.map((it) => ({
        ...it,
        renderW: Math.floor(it.ratio * targetRowHeight),
        renderH: targetRowHeight,
      })),
    })
  }

  return rows
}

function JustifiedGallery({
  photos,
  onClickPhoto,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px',
}) {
  const { ref, width } = useContainerWidth()

  const gap = width < 640 ? 10 : 14
  const targetRowHeight = width < 640 ? 360 : width < 1024 ? 440 : 520

  const rows = useMemo(
    () => buildJustifiedRows(photos, width, targetRowHeight, gap),
    [photos, width, targetRowHeight, gap]
  )

  return (
    <div ref={ref}>
      {rows.map((row, idx) => (
        <div key={idx} className="flex" style={{ gap: `${gap}px`, marginBottom: `${gap}px` }}>
          {row.items.map((foto, i) => {
            const isPriority = idx === 0 && i < 3

            return (
              <motion.button
                key={foto.id}
                type="button"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                onClick={() => onClickPhoto(foto)}
                className="overflow-hidden cursor-pointer"
                style={{ width: `${foto.renderW}px`, height: `${foto.renderH}px`, flex: '0 0 auto' }}
              >
                <Image
                  src={foto.url}
                  alt={foto.nombre || 'Foto'}
                  width={foto.renderW}
                  height={foto.renderH}
                  className="w-full h-full object-cover"
                  sizes={sizes}
                  priority={isPriority}
                  loading={isPriority ? 'eager' : 'lazy'}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP8////fwAJ/wP+vnnNAAAAAElFTkSuQmCC"
                />
              </motion.button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default function Portfolio() {
  const [fotos, setFotos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [paginaActual, setPaginaActual] = useState(1)

  const fotosPorPagina = 30
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const { data: allFotos } = await supabase
        .from('fotos')
        .select('*')
        .order('created_at', { ascending: false })

      const { data: allCategorias } = await supabase
        .from('categorias')
        .select('*')
        .order('nombre')

      setFotos(allFotos || [])
      setCategorias(allCategorias || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  const fotosActuales = useMemo(() => {
    const end = paginaActual * fotosPorPagina
    const start = end - fotosPorPagina
    return fotos.slice(start, end)
  }, [fotos, paginaActual])

  const totalPaginas = useMemo(() => Math.ceil(fotos.length / fotosPorPagina), [fotos.length])

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const irACategoria = (categoriaId) => {
    if (!categoriaId) return
    router.push(`/categoria/${categoriaId}`)
  }

  const abrirFotoEnCategoria = (foto) => {
    if (!foto?.categoria_id) return
    router.push(`/categoria/${foto.categoria_id}?photo=${foto.id}`)
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 font-serif">
      <NextSeo
        title="Portfolio Fotográfico - Irina Wetzel"
        description="Explorá el portfolio profesional de Irina Wetzel. Retratos, arte y naturaleza en imágenes únicas."
        canonical="https://irinawetzel.com/portfolio"
        openGraph={{
          title: 'Portfolio Fotográfico - Irina Wetzel',
          description: 'Explorá el portfolio profesional de Irina Wetzel. Retratos, arte y naturaleza en imágenes únicas.',
          url: 'https://irinawetzel.com/portfolio',
          type: 'website',
        }}
      />

      <Navbar />

      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-rosa-medio">Irina Wetzel</h1>
        <p className="text-lg text-gray-300 mt-2 tracking-wide">Fotografía Profesional</p>
      </div>

      {/* Categorías (con aire para que no se peguen al borde del navbar) */}
      <div className="flex flex-wrap gap-3 justify-center mb-14 mt-8">
        <button
          type="button"
          onClick={() => setPaginaActual(1)}
          className="group px-5 py-2 rounded-full border transition-all duration-300 text-sm sm:text-base
            border-white text-white hover:bg-[var(--rosa-medio)] hover:text-black shadow"
        >
          Todas
        </button>

        {categorias.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => irACategoria(cat.id)}
            className="group px-5 py-2 rounded-full border transition-all duration-300 text-sm sm:text-base
              border-white text-white hover:bg-[var(--rosa-medio)] hover:text-black shadow"
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 border-4 border-t-4 border-[var(--rosa-medio)] border-t-white animate-spin"></div>
        </div>
      ) : fotosActuales.length === 0 ? (
        <p className="text-center text-gray-400">No hay fotos para mostrar.</p>
      ) : (
        <div>
          <JustifiedGallery photos={fotosActuales} onClickPhoto={abrirFotoEnCategoria} />

          {totalPaginas > 1 && (
            <div className="flex justify-center mt-12 gap-6">
              <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  paginaActual === 1
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-black text-white border border-white hover:bg-[var(--rosa-medio)] hover:text-black shadow'
                }`}
              >
                ◀
              </button>
              <button
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  paginaActual === totalPaginas
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-black text-white border border-white hover:bg-[var(--rosa-medio)] hover:text-black shadow'
                }`}
              >
                ▶
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
