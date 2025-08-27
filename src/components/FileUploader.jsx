import React from 'react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

export default function FileUploader({ onDataLoaded }) {
  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    const ext = file.name.split('.').pop().toLowerCase()

    reader.onload = (evt) => {
      if (ext === 'csv') {
        const parsed = Papa.parse(evt.target.result, { header: true })
        const data = parsed.data
        autoDetect(data)
      } else if (ext === 'xlsx') {
        const workbook = XLSX.read(evt.target.result, { type: 'binary' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(sheet)
        autoDetect(data)
      }
    }

    if (ext === 'csv') reader.readAsText(file)
    else reader.readAsBinaryString(file)
  }

  const autoDetect = (data) => {
    const columns = Object.keys(data[0])
    const target = columns.find(c => c.toLowerCase().includes("overall"))
    const features = columns.filter(c => c !== target && c.toLowerCase() !== "group")
    onDataLoaded(data, target, features)
  }

  return (
    <div className="mb-4">
      <input type="file" accept=".csv, .xlsx" onChange={handleFile} />
    </div>
  )
}