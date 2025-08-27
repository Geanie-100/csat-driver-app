import React, { useState } from 'react'

export default function WhatIfSimulator({ data, config }) {
  const [feature, setFeature] = useState(config.features[0])
  const [delta, setDelta] = useState(1)
  const [prediction, setPrediction] = useState(null)

  const simulate = () => {
    if (!feature) return
    let base = data.map(d => d[config.target]).reduce((a,b)=>a+b,0)/data.length
    let featureMean = data.map(d => d[feature]).reduce((a,b)=>a+b,0)/data.length
    let newMean = featureMean + Number(delta)
    let shift = (newMean - featureMean) * 0.2 // rough multiplier
    setPrediction(base + shift)
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>What-if Simulator</h2>
      <div>
        <label>Feature: </label>
        <select value={feature} onChange={e=>setFeature(e.target.value)}>
          {config.features.map(f=>(<option key={f}>{f}</option>))}
        </select>
      </div>
      <div>
        <label>Change (+/-): </label>
        <input type="number" value={delta} onChange={e=>setDelta(e.target.value)} />
      </div>
      <button onClick={simulate}>Simulate</button>
      {prediction && <div>Predicted Overall CSAT: {prediction.toFixed(2)}</div>}
    </div>
  )
}
