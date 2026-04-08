'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Search, ChevronDown, Phone, MapPin, Loader2 } from 'lucide-react'
import { formatDate, RESTAURANT_STATUS_LABELS } from '@/lib/utils'
import type { Restaurant } from '@/types'

const STATUS_BADGE: Record<string, string> = {
  pending: 'badge-yellow',
  approved: 'badge-green',
  rejected: 'badge-red',
  suspended: 'badge-gray',
}

export function ClientsTable({ restaurants }: { restaurants: Restaurant[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})

  const filtered = restaurants.filter((r) => {
    const matchSearch = r.business_name.toLowerCase().includes(search.toLowerCase()) ||
      r.contact_name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || r.status === filter
    return matchSearch && matchFilter
  })

  async function updateStatus(id: string, status: string, note?: string) {
    setLoading(id)
    const supabase = createClient()
    await supabase.from('restaurants').update({
      status,
      admin_notes: note ?? null,
      approved_at: status === 'approved' ? new Date().toISOString() : null,
    }).eq('id', id)
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input-field pl-9"
            placeholder="Buscar por nombre o contacto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected', 'suspended'].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                filter === s ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}>
              {s === 'all' ? 'Todos' : RESTAURANT_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">Sin resultados</div>
        ) : (
          <div className="divide-y">
            {filtered.map((r) => (
              <details key={r.id} className="group">
                <summary className="px-5 py-4 flex items-center justify-between cursor-pointer list-none hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {r.business_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{r.business_name}</p>
                      <p className="text-xs text-gray-400">{r.contact_name} · {formatDate(r.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[r.status] ?? 'badge-gray'}`}>
                      {RESTAURANT_STATUS_LABELS[r.status]}
                    </span>
                    <ChevronDown size={16} className="text-gray-400 group-open:rotate-180 transition-transform" />
                  </div>
                </summary>

                {/* Expanded detail */}
                <div className="px-5 pb-5 border-t border-gray-100 pt-4 bg-gray-50">
                  <div className="grid sm:grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="space-y-2">
                      <p className="flex items-center gap-2 text-gray-600">
                        <Phone size={13} className="text-gray-400" /> {r.phone}
                      </p>
                      <p className="flex items-center gap-2 text-gray-600">
                        <MapPin size={13} className="text-gray-400" /> {r.address}, {r.municipality}, {r.city}
                      </p>
                      {r.rfc && <p className="text-gray-500">RFC: {r.rfc}</p>}
                      {r.restaurant_type && <p className="text-gray-500">Tipo: {r.restaurant_type}</p>}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Email</p>
                      <p className="text-gray-700">{r.email}</p>
                    </div>
                  </div>

                  {/* Note */}
                  <div className="mb-3">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                      Nota interna (opcional)
                    </label>
                    <input
                      type="text"
                      className="input-field text-sm"
                      placeholder="Motivo de rechazo, observaciones..."
                      value={notes[r.id] ?? r.admin_notes ?? ''}
                      onChange={(e) => setNotes((prev) => ({ ...prev, [r.id]: e.target.value }))}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {r.status !== 'approved' && (
                      <button
                        onClick={() => updateStatus(r.id, 'approved', notes[r.id])}
                        disabled={loading === r.id}
                        className="btn-primary py-2 px-4 text-sm"
                      >
                        {loading === r.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                        Aprobar
                      </button>
                    )}
                    {r.status !== 'rejected' && (
                      <button
                        onClick={() => updateStatus(r.id, 'rejected', notes[r.id])}
                        disabled={loading === r.id}
                        className="btn-danger py-2 px-4 text-sm"
                      >
                        <XCircle size={14} /> Rechazar
                      </button>
                    )}
                    {r.status === 'approved' && (
                      <button
                        onClick={() => updateStatus(r.id, 'suspended', notes[r.id])}
                        disabled={loading === r.id}
                        className="btn-secondary py-2 px-4 text-sm"
                      >
                        Suspender
                      </button>
                    )}
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
