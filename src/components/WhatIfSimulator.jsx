import React, { useState } from 'react'

export default function WhatIfSimulator({ data, target, features }) {
  const [feature, setFeature] = useState(features[0])
  const [delta, setDelta] = useState(10)

  if (!target || features.length === 0) return null

  const calcLift = () => {
    const xs = data.map(d => parseFloat(d[feature]) || 0)
    const ys = data.map(d => parseFloat(d[target]) || 0)
    const xMean = xs.reduce((a,b) => a+b,0)/xs.length
    const yMean = ys.reduce((a,b) => a+b,0)/ys.length
    const num = xs.map((x,i) => (x-xMean)*(ys[i]-yMean)).reduce((a,b) => a+b,0)
    const den = xs.map(x => (x-xMean)**2).reduce((a,b) => a+b,0)
    const beta = den === 0 ? 0 : num/den
    return beta * delta
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">What-if Simulator</h2>
      <div className="mb-2">
        <label>Feature: </label>
        <select value={feature} onChange={e => setFeature(e.target.value)}>
          {features.map(f => <option key={f}>{f}</option>)}
        </select>
      </div>
      <div className="mb-2">
        <label>Improvement (points): </label>
        <input type="number" value={delta} onChange={e => setDelta(parseInt(e.target.value) || 0)} />
      </div>
      <p>Estimated Overall CSAT Lift: <strong>{calcLift().toFixed(2)}%</strong></p>
    </div>
  )
}