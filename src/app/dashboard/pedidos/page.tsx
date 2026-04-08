import { createClient } from '@/lib/supabase/server'
import { Package, ChevronDown } from 'lucide-react'
import { formatDate, formatKg, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'
import Link from 'next/link'
import type { Order } from '@/types'

export default async function PedidosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id')
    .eq('user_id', user!.id)
    .single()

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*, products(name))')
    .eq('restaurant_id', restaurant?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Mis pedidos</h1>
          <p className="text-gray-500 text-sm mt-1">{orders?.length ?? 0} pedidos en total</p>
        </div>
        <Link href="/dashboard/catalogo" className="btn-primary">
          + Nuevo pedido
        </Link>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="card py-16 text-center text-gray-400">
          <Package size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No tienes pedidos aún</p>
          <Link href="/dashboard/catalogo" className="text-brand-600 text-sm font-semibold hover:underline block mt-2">
            Hacer tu primer pedido →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order: Order & { order_items: Array<{ products: { name: string } }> }) => (
            <details key={order.id} className="card group">
              <summary className="px-5 py-4 flex items-center justify-between cursor-pointer list-none hover:bg-gray-50 rounded-xl transition-colors">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-bold text-gray-900">{order.order_number}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Solicitado: {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="hidden sm:block text-sm text-gray-500">
                    Entrega: {formatDate(order.delivery_date)}
                  </div>
                  <div className="hidden sm:block text-sm font-semibold text-gray-700">
                    {formatKg(order.total_kg)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                  <ChevronDown size={16} className="text-gray-400 group-open:rotate-180 transition-transform" />
                </div>
              </summary>

              <div className="px-5 pb-4 border-t border-gray-100 pt-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Productos</p>
                <div className="space-y-1">
                  {order.order_items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{item.product_name}</span>
                      <span className="text-gray-500">{item.quantity_kg} kg · ${item.unit_price}/kg</span>
                    </div>
                  ))}
                </div>
                {order.notes && (
                  <p className="text-xs text-gray-400 mt-3 border-t border-gray-100 pt-2">
                    Nota: {order.notes}
                  </p>
                )}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  )
}
