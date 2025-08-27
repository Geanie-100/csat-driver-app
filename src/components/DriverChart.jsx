import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function DriverChart({ data, config }) {
  if (!config.target || config.features.length === 0) {
    return <div style={{color:'red'}}>Missing target or features — check your file headers.</div>
  }

  // Simple correlation as proxy for "importance"
  const correlations = config.features.map(f => {
    let xs = data.map(d => d[f])
    let ys = data.map(d => d[config.target])
    let meanX = xs.reduce((a,b)=>a+b,0)/xs.length
    let meanY = ys.reduce((a,b)=>a+b,0)/ys.length
    let num = xs.map((x,i)=>(x-meanX)*(ys[i]-meanY)).reduce((a,b)=>a+b,0)
    let den = Math.sqrt(xs.map(x=>(x-meanX)**2).reduce((a,b)=>a+b,0)*ys.map(y=>(y-meanY)**2).reduce((a,b)=>a+b,0))
    let corr = den ? num/den : 0
    return { feature: f, importance: Math.round(corr*100)/100 }
  })

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Feature Importance (Correlation with {config.target})</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={correlations}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="feature" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="importance" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
