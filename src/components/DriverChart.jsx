import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function DriverChart({ data, target, features }) {
  if (!target || features.length === 0) return null

  // naive correlation as proxy for importance
  const correlations = features.map(f => {
    const xs = data.map(d => parseFloat(d[f]) || 0)
    const ys = data.map(d => parseFloat(d[target]) || 0)
    const xMean = xs.reduce((a,b) => a+b,0)/xs.length
    const yMean = ys.reduce((a,b) => a+b,0)/ys.length
    const num = xs.map((x,i) => (x-xMean)*(ys[i]-yMean)).reduce((a,b) => a+b,0)
    const den = Math.sqrt(xs.map(x => (x-xMean)**2).reduce((a,b) => a+b,0) * ys.map(y => (y-yMean)**2).reduce((a,b) => a+b,0))
    const corr = den === 0 ? 0 : num/den
    return { feature: f, importance: Math.abs(corr) }
  })

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Driver Importance</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={correlations}>
          <XAxis dataKey="feature" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="importance" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}