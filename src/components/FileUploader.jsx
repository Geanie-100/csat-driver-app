
import React, { useEffect, useMemo, useState } from 'react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

const AEMap = { A:5, B:4, C:3, D:2, E:1 }

export default function FileUploader({ onDataLoaded, onMessage }) {
  const [rows, setRows] = useState([])
  const [headers, setHeaders] = useState([])
  const [target, setTarget] = useState('')
  const [group, setGroup] = useState('')
  const [features, setFeatures] = useState([])

  function normalizeCell(v) {
    if (v === null || v === undefined) return v
    if (typeof v === 'string') {
      const t = v.trim()
      if (t in AEMap) return AEMap[t]
      if (/^\d+(\.\d+)?%$/.test(t)) return parseFloat(t.replace('%',''))
      if (/^\d+(\.\d+)?$/.test(t)) return parseFloat(t)
      return t
    }
    return v
  }

  function parseCSV(file) {
    Papa.parse(file, {
      header: true, dynamicTyping: false, skipEmptyLines: true,
      complete: (res) => {
        const data = res.data.map(r => Object.fromEntries(Object.entries(r).map(([k,v]) => [k, normalizeCell(v)])))
        postLoad(data)
      },
      error: (err) => onMessage?.('CSV parse error: ' + err.message)
    })
  }

  function parseXLSX(file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const wb = XLSX.read(e.target.result, { type: 'binary' })
      const sheet = wb.Sheets[wb.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(sheet, { defval: '' })
      const data = json.map(r => Object.fromEntries(Object.entries(r).map(([k,v]) => [k, normalizeCell(v)])))
      postLoad(data)
    }
    reader.readAsBinaryString(file)
  }

  function postLoad(data) {
    if (!data || !data.length) return onMessage?.('No rows detected.')
    const cols = Object.keys(data[0])
    setRows(data)
    setHeaders(cols)

    // auto-detect
    const tgt = cols.find(h => /overall|overall csat|overall satisfaction|csat score/i.test(h)) || ''
    const grp = cols.find(h => /group|segment|cohort/i.test(h)) || ''
    const feats = cols.filter(h => h !== tgt && h !== grp && data.some(d => typeof d[h] === 'number'))

    setTarget(tgt)
    setGroup(grp)
    setFeatures(feats)

    if (!tgt) onMessage?.('Could not auto-detect Overall column. Please pick it below.')
  }

  function handleFile(e) {
    onMessage?.('')
    const file = e.target.files?.[0]
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    if (ext === 'csv') parseCSV(file)
    else if (ext === 'xlsx') parseXLSX(file)
    else onMessage?.('Unsupported file type. Please upload .csv or .xlsx')
  }

  const ready = useMemo(() => {
    return rows.length > 0 && target && features.length > 0
  }, [rows, target, features])

  useEffect(() => {
    if (ready) onDataLoaded(rows, { target, group, features })
  }, [ready])

  return (
    <div style={{ marginBottom: '1rem' }}>
      <input type="file" accept=".csv,.xlsx" onChange={handleFile} />
      {rows.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
            <div>
              <label><strong>Overall (target):</strong></label><br/>
              <select value={target} onChange={e=>setTarget(e.target.value)}>
                <option value="">-- Select --</option>
                {headers.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label><strong>Group (optional):</strong></label><br/>
              <select value={group} onChange={e=>setGroup(e.target.value)}>
                <option value="">-- None --</option>
                {headers.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          </div>
          <div style={{marginTop:'0.5rem'}}>
            <label><strong>Feature columns:</strong></label><br/>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
              {headers.map(h => (
                <label key={h} style={{ fontSize:'0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={features.includes(h)}
                    onChange={e => {
                      if (e.target.checked) setFeatures(prev => [...prev, h])
                      else setFeatures(prev => prev.filter(x => x !== h))
                    }}
                  /> {h}
                </label>
              ))}
            </div>
          </div>
          <div style={{marginTop:'0.5rem', color:'#64748b'}}>Showing first 5 rows:</div>
          <pre style={{maxHeight:'200px', overflow:'auto', background:'#f8fafc', padding:'0.5rem', borderRadius:'8px'}}>
{JSON.stringify(rows.slice(0,5), null, 2)}
          </pre>
          {!ready && <div style={{color:'#b91c1c'}}>Pick a target and at least one numeric feature to proceed.</div>}
        </div>
      )}
    </div>
  )
}
