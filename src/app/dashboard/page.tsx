import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Package, ShoppingCart, Clock, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react'
import { formatDate, formatKg, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, RESTAURANT_STATUS_LABELS } from '@/lib/utils'
import type { Order } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('user_id', user!.id)
    .single()

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('restaurant_id', restaurant?.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const isPending = restaurant?.status === 'pending'
  const isApproved = restaurant?.status === 'approved'
  const isRejected = restaurant?.status === 'rejected'

  const totalOrders = orders?.length ?? 0
  const activeOrders = orders?.filter((o: Order) => ['pending', 'confirmed', 'preparing'].includes(o.status)).length ?? 0

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      {isPending && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
          <Clock size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-amber-800">Cuenta en revisión</p>
            <p className="text-sm text-amber-700 mt-0.5">
              Estamos revisando tu solicitud. Te notificaremos en las próximas 24 horas.
              Mientras tanto, puedes explorar el catálogo.
            </p>
          </div>
        </div>
      )}

      {isRejected && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-800">Solicitud no aprobada</p>
            <p className="text-sm text-red-700 mt-0.5">
              Contacta a nuestro equipo para más información.
              {restaurant?.admin_notes && ` Nota: ${restaurant.admin_notes}`}
            </p>
          </div>
        </div>
      )}

      {isApproved && (
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 flex items-start gap-3">
          <CheckCircle size={20} className="text-brand-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-brand-800">Cuenta activa ✓</p>
            <p className="text-sm text-brand-700 mt-0.5">
              Ya puedes hacer pedidos. Recuerda el mínimo semanal de 400 kg.
            </p>
          </div>
        </div>
      )}

      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Hola, {restaurant?.contact_name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1">{restaurant?.business_name}</p>
        </div>
        {isApproved && (
          <Link href="/dashboard/catalogo" className="btn-primary">
            <ShoppingCart size={16} /> Hacer pedido
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Pedidos totales', value: totalOrders, icon: <Package size={20} className="text-brand-600" />, color: 'brand' },
          { label: 'Pedidos activos', value: activeOrders, icon: <Clock size={20} className="text-blue-600" />, color: 'blue' },
          { label: 'Estado de cuenta', value: RESTAURANT_STATUS_LABELS[restaurant?.status ?? 'pending'], icon: <CheckCircle size={20} className="text-green-600" />, color: 'green', small: true },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">{s.label}</p>
              {s.icon}
            </div>
            <p className={`font-extrabold ${s.small ? 'text-base' : 'text-3xl'} text-gray-900`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Pedidos recientes</h2>
          <Link href="/dashboard/pedidos" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
            Ver todos <ChevronRight size={14} />
          </Link>
        </div>
        {!orders || orders.length === 0 ? (
          <div className="px-5 py-12 text-center text-gray-400">
            <Package size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Aún no tienes pedidos</p>
            {isApproved && (
              <Link href="/dashboard/catalogo" className="text-brand-600 text-sm font-semibold hover:underline block mt-2">
                Hacer tu primer pedido →
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {orders.map((order: Order) => (
              <div key={order.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-semibold text-sm text-gray-900">{order.order_number}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDate(order.created_at)} · {formatKg(order.total_kg)}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
