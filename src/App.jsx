
import React, { useState } from 'react'
import FileUploader from './components/FileUploader'
import DriverChart from './components/DriverChart'
import WhatIfSimulator from './components/WhatIfSimulator'

export default function App() {
  const [data, setData] = useState(null)
  const [config, setConfig] = useState(null)
  const [message, setMessage] = useState('')

  return (
    <div style={{ padding: '2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h1>📊 CSAT Driver Analysis</h1>
      <p style={{color:'#475569'}}>Upload a CSV or Excel (.xlsx). The app will auto-detect columns and fall back to manual selection if needed.</p>
      <FileUploader onDataLoaded={(d, c) => { setData(d); setConfig(c); setMessage('') }} onMessage={setMessage} />
      {message && <div style={{color:'#b91c1c', marginTop:'0.5rem'}}>{message}</div>}
      {data && config && (
        <>
          <DriverChart data={data} config={config} />
          <WhatIfSimulator data={data} config={config} />
        </>
      )}
    </div>
  )
}
