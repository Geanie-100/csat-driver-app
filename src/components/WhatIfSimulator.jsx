
import React, { useMemo, useState } from 'react'

function simpleBeta(xs, ys) {
  const n = xs.length
  const mx = xs.reduce((a,b)=>a+b,0)/n
  const my = ys.reduce((a,b)=>a+b,0)/n
  const num = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0)
  const den = xs.reduce((s, x) => s + (x - mx) ** 2, 0)
  return den ? num / den : 0
}

export default function WhatIfSimulator({ data, config }) {
  const { target, features } = config
  const [deltas, setDeltas] = useState(Object.fromEntries(features.map(f => [f, 0])))

  const betas = useMemo(() => {
    const map = {}
    for (const f of features) {
      const xs = data.map(d => Number(d[f]) || 0)
      const ys = data.map(d => Number(d[target]) || 0)
      map[f] = simpleBeta(xs, ys)
    }
    return map
  }, [data, features, target])

  const baseline = useMemo(() => {
    const ys = data.map(d => Number(d[target]) || 0)
    return ys.reduce((a,b)=>a+b,0)/ys.length
  }, [data, target])

  const lift = Object.entries(deltas).reduce((sum, [f, d]) => sum + (betas[f]||0) * Number(d||0), 0)
  const projected = baseline + lift

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>What‑If Simulator</h2>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'0.75rem'}}>
        {features.map(f => (
          <div key={f}>
            <label style={{display:'block', fontSize:'0.9rem'}}>{f} Δ (points):</label>
            <input
              type="number"
              value={deltas[f]}
              onChange={e => setDeltas(prev => ({ ...prev, [f]: e.target.value }))}
              style={{width:'100%'}}
            />
            <div style={{fontSize:'0.8rem', color:'#64748b'}}>β ≈ {betas[f]?.toFixed(3) ?? 0}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:'0.75rem'}}>Predicted CSAT lift: <strong>{lift.toFixed(2)}</strong></div>
      <div>Projected Overall CSAT: <strong>{projected.toFixed(2)}</strong></div>
      <div style={{fontSize:'0.8rem', color:'#64748b'}}>Directional estimate from observational data; treat as indicative, not guaranteed.</div>
    </div>
  )
}
