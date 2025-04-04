// pages/login.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      router.push('/admin') // redirige al panel
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-black font-serif px-4">
      <form onSubmit={handleLogin} className="bg-black bg-opacity-80 p-8 shadow-2xl rounded-2xl w-full max-w-md border border-white">
        <h2 className="text-3xl font-bold mb-6 text-center text-rosa-medio">Panel de Fotógrafo</h2>
        
        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}
  
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 rounded bg-transparent border border-white text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rosa-medio transition"
        />
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full mb-6 px-4 py-2 rounded bg-transparent border border-white text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rosa-medio transition"
        />
        
        <button
          type="submit"
          className="w-full bg-rosa-medio hover:bg-rosa-claro text-black font-semibold py-2 rounded transition-all duration-300"
        >
          Ingresar
        </button>
      </form>
    </div>
  )  
}
