import React, { useState } from 'react'
import FileUploader from './components/FileUploader'
import DriverChart from './components/DriverChart'
import WhatIfSimulator from './components/WhatIfSimulator'

export default function App() {
  const [data, setData] = useState(null)
  const [config, setConfig] = useState(null)

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📊 CSAT Driver Analysis</h1>
      <FileUploader onDataLoaded={(d, c) => { setData(d); setConfig(c) }} />
      {data && config && (
        <>
          <DriverChart data={data} config={config} />
          <WhatIfSimulator data={data} config={config} />
        </>
      )}
    </div>
  )
}
