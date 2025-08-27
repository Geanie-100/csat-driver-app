import React, { useState } from 'react'
import FileUploader from './components/FileUploader'
import DriverChart from './components/DriverChart'
import WhatIfSimulator from './components/WhatIfSimulator'

export default function App() {
  const [data, setData] = useState(null)
  const [target, setTarget] = useState(null)
  const [features, setFeatures] = useState([])

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">CSAT Driver Analysis</h1>
      <FileUploader onDataLoaded={(d, t, f) => { setData(d); setTarget(t); setFeatures(f) }} />
      {data && (
        <>
          <DriverChart data={data} target={target} features={features} />
          <WhatIfSimulator data={data} target={target} features={features} />
        </>
      )}
    </div>
  )
}