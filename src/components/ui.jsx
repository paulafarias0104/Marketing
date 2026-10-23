import { useEffect, useState } from 'react'
import { statusMeta } from '../lib/utils'

export function Button({children,className='',variant='default',...props}){
  const styles=variant==='primary'
    ?'border-[#1B328E] bg-gradient-to-r from-[#1B328E] to-[#315BDB] text-white shadow-[0_8px_20px_rgba(27,50,142,.18)] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(27,50,142,.22)]'
    :variant==='danger'
      ?'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
      :'border-slate-200/90 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-[#CBD5F5] hover:bg-[#F8FAFF] hover:text-[#1B328E]'
  return <button className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${styles} disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${className}`} {...props}>{children}</button>
}

export function StatusBadge({item}){
  const s=statusMeta(item)
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-[0_1px_2px_rgba(15,23,42,.03)] ${s.className}`}>{s.icon} {s.label}</span>
}

export function ViewToggle({value,onChange}){
  return <div className="inline-flex rounded-xl border border-slate-200/90 bg-white p-1 shadow-sm">
    <button onClick={()=>onChange('grid')} className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${value==='grid'?'bg-[#1B328E] text-white shadow-sm':'text-slate-500 hover:bg-slate-50 hover:text-[#1B328E]'}`}>▦ Grid</button>
    <button onClick={()=>onChange('list')} className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${value==='list'?'bg-[#1B328E] text-white shadow-sm':'text-slate-500 hover:bg-slate-50 hover:text-[#1B328E]'}`}>☷ Lista</button>
  </div>
}

export function Empty({children='Sin registros.'}){return <div className="rounded-[22px] border border-dashed border-[#CCD5F4] bg-gradient-to-br from-white to-[#F7F8FF] p-10 text-center text-sm text-slate-500 shadow-[0_8px_25px_rgba(26,44,104,.04)]">{children}</div>}

export function Panel({children,className=''}){return <section className={`rounded-[24px] border border-slate-200/75 bg-white p-5 shadow-[0_10px_30px_rgba(26,44,104,.06)] ${className}`}>{children}</section>}

export function Modal({open,title,eyebrow='REGISTRO',children,onClose}){
  useEffect(()=>{const fn=e=>e.key==='Escape'&&onClose?.();if(open)window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn)},[open,onClose])
  if(!open)return null
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D174A]/35 p-4 backdrop-blur-sm" onMouseDown={e=>e.target===e.currentTarget&&onClose?.()}>
    <div className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-[28px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(13,23,74,.22)]">
      <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white/95 px-6 py-5 backdrop-blur-xl">
        <div><div className="inline-flex rounded-full bg-[#F0F2FF] px-3 py-1 text-[10px] font-black tracking-[.18em] text-[#1B328E]">{eyebrow}</div><h2 className="mt-2 text-xl font-black text-[#111A43]">{title}</h2></div>
        <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">×</button>
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
  const inputClass='w-full rounded-xl border border-slate-200 bg-[#FBFCFF] px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#7791F6] focus:bg-white focus:ring-4 focus:ring-[#1B328E]/5'
  return <Modal open={open} title={title} eyebrow={eyebrow} onClose={onClose}>
    <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map(f=><label key={f.name} className={f.full?'md:col-span-2':''}>
        <span className="mb-1.5 block text-sm font-semibold text-slate-700">{f.label}</span>
        {f.type==='textarea'?<textarea rows={4} className={inputClass} value={form[f.name]??''} onChange={e=>change(f.name,e.target.value)} />:f.type==='select'?<select className={inputClass} value={form[f.name]??''} onChange={e=>change(f.name,e.target.value)}>{(f.options||[]).map(o=>{const [v,l]=Array.isArray(o)?o:[o,o];return <option key={v} value={v}>{l}</option>})}</select>:<input type={f.type||'text'} min={f.min} step={f.step} required={f.required} className={inputClass} value={form[f.name]??''} onChange={e=>change(f.name,e.target.value)} />}
      </label>)}
      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 md:col-span-2"><Button type="button" onClick={onClose}>Cancelar</Button><Button variant="primary" type="submit">{submitLabel}</Button></div>
    </form>
  </Modal>
}
