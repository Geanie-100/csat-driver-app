import React, { useState } from 'react'
import Papa from 'papaparse'

export default function FileUploader({ onDataLoaded }) {
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.errors.length) {
          setError('Error parsing file')
          return
        }
        const data = results.data.filter(row => Object.keys(row).length > 1)

        // Preview first 5 rows
        setPreview(data.slice(0, 5))

        // Auto detect columns
        const headers = Object.keys(data[0] || {})
        let target = headers.find(h => h.toLowerCase().includes('overall'))
        let group = headers.find(h => h.toLowerCase().includes('group'))
        let features = headers.filter(h => h !== target && h !== group)

        if (!target) {
          setError('Could not auto-detect target column. Please rename it to include "Overall".')
        }

        // Map A-E to 5-1 if needed
        data.forEach(row => {
          headers.forEach(h => {
            if (['A','B','C','D','E'].includes(row[h])) {
              const map = {A:5,B:4,C:3,D:2,E:1}
              row[h] = map[row[h]]
            }
          })
        })

        onDataLoaded(data, { target, group, features })
      }
    })
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <input type="file" accept=".csv" onChange={handleFile} />
      {preview && (
        <div>
          <h3>Preview (first 5 rows):</h3>
          <pre>{JSON.stringify(preview, null, 2)}</pre>
        </div>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  )
}
