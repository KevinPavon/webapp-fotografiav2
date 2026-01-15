// pages/categoria/[id].js
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/Navbar'
import { motion } from 'framer-motion'
import Image from 'next/image'
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
            const isPriority = idx === 0 && i < 2

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

export default function Categoria() {
  const router = useRouter()
  const { id, photo } = router.query

  const [fotos, setFotos] = useState([])
  const [nombreCategoria, setNombreCategoria] = useState('')
  const [loading, setLoading] = useState(true)

  const [paginaActual, setPaginaActual] = useState(1)
  const fotosPorPagina = 30

  const [fotoActiva, setFotoActiva] = useState(null)

  // Zoom + pan
  const [zoomed, setZoomed] = useState(false)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const wrapRef = useRef(null)
  const imgRef = useRef(null)

  const draggingRef = useRef(false)
  const startRef = useRef({ x: 0, y: 0 })
  const startPanRef = useRef({ x: 0, y: 0 })

  // Swipe mobile
  const touchStartXRef = useRef(null)

  // Cache preload
  const preloadCacheRef = useRef(new Set())

  const preloadUrls = (urls) => {
    urls.forEach((u) => {
      if (!u) return
      if (preloadCacheRef.current.has(u)) return
      preloadCacheRef.current.add(u)
      const img = new window.Image()
      img.decoding = 'async'
      img.src = u
    })
  }

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      setLoading(true)

      const { data: categoria } = await supabase
        .from('categorias')
        .select('*')
        .eq('id', id)
        .single()

      const { data: fotosData } = await supabase
        .from('fotos')
        .select('*')
        .eq('categoria_id', id)
        .order('created_at', { ascending: false })

      const lista = fotosData || []
      setNombreCategoria(categoria?.nombre || 'Sin nombre')
      setFotos(lista)
      setLoading(false)

      if (photo && lista.length) {
        const targetIndex = lista.findIndex((f) => String(f.id) === String(photo))
        if (targetIndex >= 0) {
          const pagina = Math.floor(targetIndex / fotosPorPagina) + 1
          setPaginaActual(pagina)
          setFotoActiva(lista[targetIndex])
        }
      }
    }

    fetchData()
  }, [id, photo])

  const totalPaginas = useMemo(() => Math.ceil(fotos.length / fotosPorPagina), [fotos.length])

  const fotosActuales = useMemo(() => {
    const end = paginaActual * fotosPorPagina
    const start = end - fotosPorPagina
    return fotos.slice(start, end)
  }, [fotos, paginaActual])

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const abrirFoto = (foto) => {
    setZoomed(false)
    setPan({ x: 0, y: 0 })
    setFotoActiva(foto)
    router.replace({ pathname: router.pathname, query: { id, photo: foto.id } }, undefined, {
      shallow: true,
    })
  }

  const cerrarFoto = () => {
    setZoomed(false)
    setPan({ x: 0, y: 0 })
    setFotoActiva(null)
    router.replace({ pathname: router.pathname, query: { id } }, undefined, { shallow: true })
  }

  const activeIndex = useMemo(() => {
    if (!fotoActiva) return -1
    return fotos.findIndex((f) => String(f.id) === String(fotoActiva.id))
  }, [fotoActiva, fotos])

  const prevFoto = activeIndex > 0 ? fotos[activeIndex - 1] : null
  const nextFoto = activeIndex >= 0 && activeIndex < fotos.length - 1 ? fotos[activeIndex + 1] : null

  const irFoto = (foto) => {
    if (!foto) return
    setZoomed(false)
    setPan({ x: 0, y: 0 })
    preloadUrls([foto?.url].filter(Boolean))
    abrirFoto(foto)
  }

  // Preload + teclado
  useEffect(() => {
    if (!fotoActiva) return

    preloadUrls([fotoActiva.url, prevFoto?.url, nextFoto?.url].filter(Boolean))

    const onKeyDown = (e) => {
      if (e.key === 'Escape') cerrarFoto()
      if (e.key === 'ArrowLeft' && prevFoto) irFoto(prevFoto)
      if (e.key === 'ArrowRight' && nextFoto) irFoto(nextFoto)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [fotoActiva, prevFoto, nextFoto])

  // Preload suave: página actual
  useEffect(() => {
    if (!fotosActuales?.length) return
    if (typeof window === 'undefined') return

    const urls = fotosActuales.map((f) => f.url).filter(Boolean)
    const run = () => preloadUrls(urls)

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(run, { timeout: 1500 })
    } else {
      setTimeout(run, 400)
    }
  }, [fotosActuales])

  // Swipe
  const onTouchStart = (e) => {
    const x = e.touches?.[0]?.clientX
    touchStartXRef.current = typeof x === 'number' ? x : null
  }

  const onTouchEnd = (e) => {
    const startX = touchStartXRef.current
    const endX = e.changedTouches?.[0]?.clientX
    touchStartXRef.current = null

    if (typeof startX !== 'number' || typeof endX !== 'number') return
    const delta = endX - startX
    const threshold = 60

    if (delta > threshold && prevFoto) irFoto(prevFoto)
    if (delta < -threshold && nextFoto) irFoto(nextFoto)
  }

  // Pan helpers
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

  const getPanBounds = () => {
    const wrap = wrapRef.current
    const img = imgRef.current
    if (!wrap || !img) return { maxX: 0, maxY: 0 }

    const wrapRect = wrap.getBoundingClientRect()
    const imgRect = img.getBoundingClientRect()

    const maxX = Math.max(0, (imgRect.width - wrapRect.width) / 2)
    const maxY = Math.max(0, (imgRect.height - wrapRect.height) / 2)
    return { maxX, maxY }
  }

  const onPointerDown = (e) => {
    if (!zoomed) return
    e.stopPropagation()
    draggingRef.current = true
    startRef.current = { x: e.clientX, y: e.clientY }
    startPanRef.current = { ...pan }
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {}
  }

  const onPointerMove = (e) => {
    if (!zoomed || !draggingRef.current) return
    e.stopPropagation()

    const dx = e.clientX - startRef.current.x
    const dy = e.clientY - startRef.current.y

    const { maxX, maxY } = getPanBounds()
    const nextX = clamp(startPanRef.current.x + dx, -maxX, maxX)
    const nextY = clamp(startPanRef.current.y + dy, -maxY, maxY)

    setPan({ x: nextX, y: nextY })
  }

  const onPointerUp = (e) => {
    if (!zoomed) return
    e.stopPropagation()
    draggingRef.current = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {}
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 font-serif">
      <NextSeo
        title={`Categoría: ${nombreCategoria} - Irina Wetzel`}
        description={`Fotos dentro de la categoría ${nombreCategoria} en el portfolio de Irina Wetzel.`}
        canonical={`https://irinawetzel.com/categoria/${id}`}
        openGraph={{
          title: `Categoría: ${nombreCategoria} - Irina Wetzel`,
          description: `Fotos dentro de la categoría ${nombreCategoria} en el portfolio de Irina Wetzel.`,
          url: `https://irinawetzel.com/categoria/${id}`,
          type: 'website',
        }}
      />

      <Navbar />

      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-rosa-medio mb-10 mt-8">
          Categoría: {nombreCategoria}
        </h1>

        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-16 h-16 border-4 border-t-4 border-[var(--rosa-medio)] border-t-white animate-spin"></div>
          </div>
        ) : fotos.length === 0 ? (
          <p className="text-center text-gray-400">No hay fotos disponibles en esta categoría.</p>
        ) : (
          <div>
            <JustifiedGallery photos={fotosActuales} onClickPhoto={abrirFoto} />

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

      {/* Modal */}
      {fotoActiva && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={cerrarFoto}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end mb-3">
              <button
                type="button"
                onClick={cerrarFoto}
                className="text-gray-300 hover:text-white text-2xl leading-none px-2"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <div className="relative">
              <div
                ref={wrapRef}
                className="bg-black flex items-center justify-center max-h-[80vh] overflow-hidden touch-none"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              >
                <img
                  ref={imgRef}
                  src={fotoActiva.url}
                  alt={fotoActiva.nombre || 'Foto'}
                  draggable={false}
                  onClick={(e) => {
                    e.stopPropagation()
                    setZoomed((z) => {
                      const next = !z
                      setPan({ x: 0, y: 0 })
                      return next
                    })
                  }}
                  className={[
                    "block max-h-[80vh] w-auto max-w-full select-none",
                    "transition-transform duration-150 ease-out",
                    zoomed ? "cursor-grab" : "cursor-zoom-in",
                  ].join(" ")}
                  style={{
                    transformOrigin: 'center center',
                    transform: zoomed
                      ? `translate3d(${pan.x}px, ${pan.y}px, 0) scale(1.8)`
                      : 'translate3d(0,0,0) scale(1)',
                  }}
                />
              </div>

              {prevFoto ? (
                <button
                  type="button"
                  onClick={() => irFoto(prevFoto)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 text-5xl leading-none transition select-none"
                  aria-label="Foto anterior"
                >
                  ‹
                </button>
              ) : null}

              {nextFoto ? (
                <button
                  type="button"
                  onClick={() => irFoto(nextFoto)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 text-5xl leading-none transition select-none"
                  aria-label="Foto siguiente"
                >
                  ›
                </button>
              ) : null}
            </div>

            <p className="mt-2 text-xs text-gray-500 sm:hidden text-center">
              Deslizá para cambiar de foto. Tocá para zoom y arrastrá para moverte.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
