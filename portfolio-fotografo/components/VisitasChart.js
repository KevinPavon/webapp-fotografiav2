import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function VisitasChart({ data = [], labels = [] }) {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Visitas',
        data,
        fill: false,
        borderColor: '#f48fb1', // Rosa medio
        tension: 0.4,
        pointBackgroundColor: '#f48fb1',
        pointRadius: 5,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    },
    scales: {
      x: { ticks: { color: '#fff' } },
      y: { ticks: { color: '#fff' } },
    },
  }

  return (
    <div className="bg-black bg-opacity-70 p-6 rounded-xl shadow-md text-center mt-6">
      <h2 className="text-2xl font-bold mb-4 text-rosa-medio">Visitas últimas 7 días</h2>
      <Line data={chartData} options={options} />
    </div>
  )
}
