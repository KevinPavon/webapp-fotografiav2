import Navbar from '../components/Navbar'
import { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import emailjs from '@emailjs/browser'

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  })

  const [enviado, setEnviado] = useState(false)
  const mensajeRef = useRef(null)
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // ⚡ ENVÍO REAL del mail usando EmailJS
    try {
        await emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
            {
              nombre: formData.nombre,
              email: formData.email,
              mensaje: formData.mensaje,
              title: 'Nuevo mensaje de contacto'
            },
            process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
        )
                
      setEnviado(true)
      setFormData({ nombre: '', email: '', mensaje: '' })

      setTimeout(() => {
        mensajeRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 300)

      setTimeout(() => {
        router.push('/portfolio')
      }, 5000)

    } catch (error) {
      console.error('Error al enviar el formulario:', error)
      alert('Hubo un error al enviar el mensaje. Intentalo nuevamente.')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 font-serif">
      <Navbar />

      <div className="max-w-2xl mx-auto bg-black bg-opacity-80 rounded-2xl p-8 shadow-2xl mt-10">
        <h1 className="text-4xl font-bold text-rosa-medio text-center mb-8">
          Contacto
        </h1>

        {enviado ? (
          <p
            ref={mensajeRef}
            className="text-center text-2xl text-white mt-10"
          >
            ¡Gracias por tu mensaje! Redirigiendo...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-white">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-neutral-900 text-white border border-white focus:outline-none focus:ring-2 focus:ring-rosa-medio"
              />
            </div>
            <div>
              <label className="block mb-2 text-white">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-neutral-900 text-white border border-white focus:outline-none focus:ring-2 focus:ring-rosa-medio"
              />
            </div>
            <div>
              <label className="block mb-2 text-white">Mensaje</label>
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                rows="5"
                required
                className="w-full p-3 rounded-lg bg-neutral-900 text-white border border-white focus:outline-none focus:ring-2 focus:ring-rosa-medio"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-rosa-medio hover:bg-rosa-oscuro text-black font-semibold py-3 rounded-lg transition-all duration-300"
            >
              Enviar
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
