import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

// Register required Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const PALETTE = [
  '#6366f1', // Indigo
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#14b8a6', // Teal
  '#f97316'  // Orange
]

/**
 * Category Bar Chart - Product Count per Category
 */
export const CategoryBarChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>No category data available</p>
      </div>
    )
  }

  const labels = data.map((item) => item.category || item._id || 'Uncategorized')
  const counts = data.map((item) => item.count || 0)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Products Count',
        data: counts,
        backgroundColor: labels.map((_, i) => PALETTE[i % PALETTE.length] + 'cc'),
        borderColor: labels.map((_, i) => PALETTE[i % PALETTE.length]),
        borderWidth: 1.5,
        borderRadius: 6,
        hoverBackgroundColor: labels.map((_, i) => PALETTE[i % PALETTE.length])
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        cornerRadius: 8,
        titleFont: { family: 'Inter', weight: '600' },
        bodyFont: { family: 'Inter' }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(51, 65, 85, 0.4)',
          drawBorder: false
        },
        ticks: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 11 }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(51, 65, 85, 0.4)',
          drawBorder: false
        },
        ticks: {
          color: '#94a3b8',
          stepSize: 1,
          font: { family: 'Inter', size: 11 }
        }
      }
    }
  }

  return (
    <div className="chart-wrapper">
      <Bar data={chartData} options={options} />
    </div>
  )
}

/**
 * Category Pie/Doughnut Chart - Inventory Valuation Share per Category
 */
export const CategoryPieChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>No category data available</p>
      </div>
    )
  }

  const labels = data.map((item) => item.category || item._id || 'Uncategorized')
  const values = data.map((item) => item.totalValue || 0)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Inventory Value',
        data: values,
        backgroundColor: labels.map((_, i) => PALETTE[i % PALETTE.length] + 'cc'),
        borderColor: '#1e293b',
        borderWidth: 2,
        hoverOffset: 6
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#94a3b8',
          boxWidth: 12,
          boxHeight: 12,
          padding: 14,
          font: { family: 'Inter', size: 12 }
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        titleFont: { family: 'Inter', weight: '600' },
        bodyFont: { family: 'Inter' },
        callbacks: {
          label: (context) => {
            const val = context.raw || 0
            return ` ₹${Number(val).toLocaleString('en-IN')}`
          }
        }
      }
    }
  }

  return (
    <div className="chart-wrapper">
      <Doughnut data={chartData} options={options} />
    </div>
  )
}
