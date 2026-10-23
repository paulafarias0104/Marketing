import * as XLSX from 'xlsx'

const safeName=value=>String(value||'Hoja').replace(/[\\/?*\[\]:]/g,' ').slice(0,31)||'Hoja'

export function downloadWorkbook(filename,sheets){
  const wb=XLSX.utils.book_new()
  Object.entries(sheets).forEach(([name,rows])=>{
    const data=Array.isArray(rows)&&rows.length?rows:[{Información:'Sin registros'}]
    XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(data),safeName(name))
  })
  XLSX.writeFile(wb,filename)
}

export function downloadSheet(filename,sheetName,rows){
  downloadWorkbook(filename,{[sheetName]:rows})
}

export async function readFirstSheet(file){
  const data=await file.arrayBuffer()
  const wb=XLSX.read(data)
  return XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{defval:''})
}

export const slugFile=value=>String(value||'archivo').trim().replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]+/g,'_').replace(/^_+|_+$/g,'')
