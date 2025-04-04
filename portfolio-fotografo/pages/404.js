import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Custom404() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/portfolio')
    }, 1200) // Redirige después de 1.2 segundos
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white font-serif">
      <div className="w-16 h-16 border-4 border-t-4 border-[var(--rosa-medio)] border-t-white rounded-full animate-spin mb-6"></div>
      <h1 className="text-2xl text-rosa-medio font-bold">Redireccionando al Portfolio...</h1>
    </div>
  )
}
