
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

function corr(xs, ys) {
  const n = xs.length
  const mx = xs.reduce((a,b)=>a+b,0)/n
  const my = ys.reduce((a,b)=>a+b,0)/n
  const num = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0)
  const den = Math.sqrt(xs.reduce((s, x) => s + (x - mx) ** 2, 0) * ys.reduce((s, y) => s + (y - my) ** 2, 0))
  return den ? num / den : 0
}

export default function DriverChart({ data, config }) {
  const { target, features } = config
  if (!target || !features?.length) return null

  const points = features.map(f => {
    const xs = data.map(d => Number(d[f]) || 0)
    const ys = data.map(d => Number(d[target]) || 0)
    return { feature: f, importance: Math.round(Math.abs(corr(xs, ys))*100)/100 }
  })

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Feature Importance (correlation with {target})</h2>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={points}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="feature" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="importance" fill="#0f172a" radius={[6,6,0,0]} />
        </BarChart>
      </ResponsiveContainer>
      <div style={{fontSize:'0.85rem', color:'#64748b'}}>Higher = stronger relationship to Overall CSAT. Use for prioritization; not a guarantee of causal lift.</div>
    </div>
  )
}
