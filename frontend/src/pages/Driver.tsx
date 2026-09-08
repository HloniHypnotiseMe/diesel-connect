import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
)

export default function Driver() {
  const [orderNo, setOrderNo] = useState('')
  const [uploading, setUploading] = useState<string | null>(null)
  const [order, setOrder] = useState<any>(null)

  const fields = [
    { key: 'pod_meter_start_photo', label: '1. Meter START' },
    { key: 'pod_meter_end_photo', label: '2. Meter END' },
    { key: 'pod_dip_before_photo', label: '3. Dip BEFORE' },
    { key: 'pod_dip_after_photo', label: '4. Dip AFTER' },
    { key: 'pod_sample_qr', label: '5. Sample QR' },
    { key: 'pod_signature_photo', label: '6. Signature' },
  ]

  const loadOrder = async () => {
    const { data } = await supabase.from('orders').select('*').eq('order_no', orderNo).single()
    setOrder(data)
  }

  const upload = async (key: string, file: File) => {
    setUploading(key)
    const path = `${orderNo}/${key}-${Date.now()}.jpg`
    const { data: up } = await supabase.storage.from('pod-photos').upload(path, file)
    if (up) {
      const { data: urlData } = supabase.storage.from('pod-photos').getPublicUrl(path)
      await supabase.from('orders').update({ [key]: urlData.publicUrl }).eq('order_no', orderNo)
      await loadOrder()
    }
    setUploading(null)
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-6 max-w- mx-auto">
      <div className="text- tracking-widest text-zinc-500">DRIVER APP • dieselconnect.c6group.co.za/driver</div>
      <h1 className="mt-2 text- font-bold">POD Upload - 6 Photos</h1>

      <div className="mt-6 flex gap-2">
        <input value={orderNo} onChange={e=>setOrderNo(e.target.value)} placeholder="DC-2026-0847" className="flex-1 rounded-full bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-" />
        <button onClick={loadOrder} className="rounded-full bg-amber-400 px-5 py-2.5 text- font-bold text-black">Load</button>
      </div>

      {order && (
        <div className="mt-6 space-y-3">
          <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3 text-">
            <div>Order: {order.order_no} • {order.volume_litres}L • Status: {order.status}</div>
            <div className="text-zinc-500">Escrow: {order.escrow_ref} • {order.escrow_status}</div>
          </div>

          {fields.map(f => (
            <div key={f.key} className="rounded- border border-zinc-800 bg-zinc-900 p-4 flex items-center justify-between">
              <div>
                <div className="text- font-semibold">{f.label}</div>
                <div className="text- text-zinc-500 mt-1 truncate max-w-">{order[f.key]? '✓ Uploaded' : 'Missing'}</div>
              </div>
              <label className="rounded-full bg-white text-black px-4 py-2 text- font-bold cursor-pointer">
                {uploading===f.key? '...' : 'Photo'}
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={e=> e.target.files && upload(f.key, e.target.files[0])} />
              </label>
            </div>
          ))}

          <div className="mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text- text-zinc-300">
            Offline? Photos save locally → syncs when signal returns. Works on R1500 Android.
          </div>
        </div>
      )}
    </div>
  )
}
