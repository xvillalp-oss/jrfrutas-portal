'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Search, ChevronDown, Loader2 } from 'lucide-react'
import { formatDate, formatKg, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'

const STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled']

export function OrdersTable({ orders }: { orders: any[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState<string | null>(null)

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.restaurants?.business_name?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || o.status === filter
    return matchSearch && matchFilter
  })

  async function updateStatus(orderId: string, status: string) {
    setLoading(orderId)
    const supabase = createClient()
    await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', orderId)
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-9" placeholder="Buscar por # pedido o restaurante..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', ...STATUS_FLOW].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                filter === s ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}>
              {s === 'all' ? 'Todos' : ORDER_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">Sin pedidos</div>
        ) : (
          <div className="divide-y">
            {filtered.map((order) => (
              <details key={order.id} className="group">
                <summary className="px-5 py-4 flex items-center justify-between cursor-pointer list-none hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-bold text-sm text-gray-900">{order.order_number}</p>
                      <p className="text-xs text-gray-400">
                        {order.restaurants?.business_name} · {formatKg(order.total_kg)}
                      </p>
                    </div>
                    <div className="hidden sm:block text-xs text-gray-500">
                      Entrega: {formatDate(order.delivery_date)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                    <ChevronDown size={16} className="text-gray-400 group-open:rotate-180 transition-transform" />
                  </div>
                </summary>

                <div className="px-5 pb-5 border-t pt-4 bg-gray-50">
                  {/* Items */}
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Productos</p>
                  <div className="space-y-1 mb-4">
                    {order.order_items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.product_name}</span>
                        <span className="text-gray-500">{item.quantity_kg} kg · ${item.unit_price}/kg</span>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <p className="text-xs text-gray-500 bg-white rounded-lg px-3 py-2 border mb-4">
                      Nota del cliente: {order.notes}
                    </p>
                  )}

                  {/* Contact */}
                  <p className="text-xs text-gray-500 mb-3">
                    Contacto: {order.restaurants?.phone} · {order.restaurants?.city}
                  </p>

                  {/* Status actions */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Cambiar estado</p>
                    <div className="flex flex-wrap gap-2">
                      {STATUS_FLOW.filter((s) => s !== order.status).map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(order.id, s)}
                          disabled={loading === order.id}
                          className="btn-secondary py-1.5 px-3 text-xs"
                        >
                          {loading === order.id ? <Loader2 size={12} className="animate-spin" /> : null}
                          → {ORDER_STATUS_LABELS[s]}
                        </button>
                      ))}
                    </div>
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
