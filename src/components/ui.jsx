import { useEffect, useState } from 'react'
import { statusMeta } from '../lib/utils'

export function Button({children,className='',variant='default',...props}){
  const styles=variant==='primary'?'bg-[#011C40] text-white border-[#011C40] hover:bg-[#0b2d58]':variant==='danger'?'bg-red-50 text-red-700 border-red-200 hover:bg-red-100':'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
  return <button className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${styles} disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props}>{children}</button>
}

export function StatusBadge({item}){
  const s=statusMeta(item)
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${s.className}`}>{s.icon} {s.label}</span>
}

export function ViewToggle({value,onChange}){
  return <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
    <button onClick={()=>onChange('grid')} className={`rounded-md px-3 py-1.5 text-sm font-semibold ${value==='grid'?'bg-[#011C40] text-white':'text-slate-600'}`}>▦ Grid</button>
    <button onClick={()=>onChange('list')} className={`rounded-md px-3 py-1.5 text-sm font-semibold ${value==='list'?'bg-[#011C40] text-white':'text-slate-600'}`}>☷ Lista</button>
  </div>
}

export function Empty({children='Sin registros.'}){return <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">{children}</div>}

export function Panel({children,className=''}){return <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</section>}

export function Modal({open,title,eyebrow='REGISTRO',children,onClose}){
  useEffect(()=>{const fn=e=>e.key==='Escape'&&onClose?.();if(open)window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn)},[open,onClose])
  if(!open)return null
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" onMouseDown={e=>e.target===e.currentTarget&&onClose?.()}>
    <div className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white shadow-2xl">
      <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">
        <div><div className="text-xs font-bold tracking-[.18em] text-slate-400">{eyebrow}</div><h2 className="mt-1 text-xl font-bold text-[#011C40]">{title}</h2></div>
        <button onClick={onClose} className="rounded-full px-3 py-1 text-2xl text-slate-400 hover:bg-slate-100">×</button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
}

export function FormModal({open,title,eyebrow,fields,initial={},onClose,onSave,submitLabel='Guardar'}){
  const [form,setForm]=useState(initial)
  useEffect(()=>{if(open)setForm(initial||{})},[open,initial])
  const change=(name,value)=>setForm(prev=>({...prev,[name]:value}))
  const submit=e=>{e.preventDefault();onSave(form);onClose()}
  return <Modal open={open} title={title} eyebrow={eyebrow} onClose={onClose}>
    <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map(f=><label key={f.name} className={f.full?'md:col-span-2':''}>
        <span className="mb-1.5 block text-sm font-semibold text-slate-700">{f.label}</span>
        {f.type==='textarea'?<textarea rows={4} className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-[#12B1FD]" value={form[f.name]??''} onChange={e=>change(f.name,e.target.value)} />:f.type==='select'?<select className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-[#12B1FD]" value={form[f.name]??''} onChange={e=>change(f.name,e.target.value)}>{(f.options||[]).map(o=>{const [v,l]=Array.isArray(o)?o:[o,o];return <option key={v} value={v}>{l}</option>})}</select>:<input type={f.type||'text'} min={f.min} step={f.step} required={f.required} className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-[#12B1FD]" value={form[f.name]??''} onChange={e=>change(f.name,e.target.value)} />}
      </label>)}
      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 md:col-span-2"><Button type="button" onClick={onClose}>Cancelar</Button><Button variant="primary" type="submit">{submitLabel}</Button></div>
    </form>
  </Modal>
}
