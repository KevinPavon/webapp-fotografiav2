import VisitasChart from './VisitasChart'

export default function VisitasPanel({ total, data, labels }) {
  return (
    <div
      className="bg-black bg-opacity-70 p-8 rounded-2xl shadow-xl w-full max-w-4xl mx-auto text-white transform transition-all duration-700"
    >
      <h2 className="text-3xl font-bold text-rosa-medio mb-6 text-center">Análisis de Visitas</h2>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Contador */}
        <div className="flex-1 bg-rosa-medio p-6 rounded-xl shadow-md text-black text-center">
          <h3 className="text-xl font-semibold mb-2">Visitas Totales Últimos 7 Días</h3>
          <p className="text-4xl font-extrabold">{total}</p>
        </div>

        {/* Línea divisoria en mobile */}
        <div className="h-px bg-rosa-medio w-full md:hidden" />

        {/* Gráfico */}
        <div className="flex-1">
          <VisitasChart labels={labels} data={data} />
        </div>

      </div>
    </div>
  )
}
