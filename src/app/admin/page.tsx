import { createAdminClient } from '@/lib/supabase/server'
import { Users, Package, Clock, CheckCircle, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { formatDate, formatKg, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'
import type { Order, Restaurant } from '@/types'

export default async function AdminDashboard() {
  const db = createAdminClient()

  const [
    { count: totalClients },
    { count: pendingClients },
    { count: totalOrders },
    { count: pendingOrders },
    { data: recentOrders },
    { data: pendingRestaurants },
  ] = await Promise.all([
    db.from('restaurants').select('*', { count: 'exact', head: true }),
    db.from('restaurants').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    db.from('orders').select('*', { count: 'exact', head: true }),
    db.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    db.from('orders').select('*, restaurants(business_name)').order('created_at', { ascending: false }).limit(8),
    db.from('restaurants').select('*').eq('status', 'pending').order('created_at', { ascending: false }).limit(5),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Panel de administración</h1>
        <p className="text-gray-500 text-sm mt-1">Resumen general de JR Frutas Portal</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Clientes totales', value: totalClients ?? 0, icon: <Users size={20} className="text-blue-600" />, href: '/admin/clientes' },
          { label: 'Clientes pendientes', value: pendingClients ?? 0, icon: <Clock size={20} className="text-amber-500" />, href: '/admin/clientes?status=pending', alert: (pendingClients ?? 0) > 0 },
          { label: 'Pedidos totales', value: totalOrders ?? 0, icon: <Package size={20} className="text-brand-600" />, href: '/admin/pedidos' },
          { label: 'Pedidos por confirmar', value: pendingOrders ?? 0, icon: <TrendingUp size={20} className="text-purple-600" />, href: '/admin/pedidos?status=pending', alert: (pendingOrders ?? 0) > 0 },
        ].map((s) => (
          <Link key={s.label} href={s.href} className={`card p-5 hover:shadow-md transition-shadow ${s.alert ? 'border-amber-300' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">{s.label}</p>
              {s.icon}
            </div>
            <p className={`font-extrabold text-3xl ${s.alert && s.value > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
              {s.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending clients */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Clientes pendientes de aprobación</h2>
            <Link href="/admin/clientes" className="text-sm text-brand-600 hover:underline">Ver todos →</Link>
          </div>
          {!pendingRestaurants || pendingRestaurants.length === 0 ? (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">
              <CheckCircle size={28} className="mx-auto mb-2 opacity-30" />
              Sin solicitudes pendientes
            </div>
          ) : (
            <div className="divide-y">
              {pendingRestaurants.map((r: Restaurant) => (
                <Link key={r.id} href="/admin/clientes"
                  className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{r.business_name}</p>
                    <p className="text-xs text-gray-400">{r.city} · {formatDate(r.created_at)}</p>
                  </div>
                  <span className="badge-yellow">Pendiente</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Pedidos recientes</h2>
            <Link href="/admin/pedidos" className="text-sm text-brand-600 hover:underline">Ver todos →</Link>
          </div>
          {!recentOrders || recentOrders.length === 0 ? (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">Sin pedidos aún</div>
          ) : (
            <div className="divide-y">
              {recentOrders.map((order: any) => (
                <div key={order.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{order.order_number}</p>
                    <p className="text-xs text-gray-400">{order.restaurants?.business_name} · {formatKg(order.total_kg)}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ORDER_STATUS_COLORS[order.status as string]}`}>
                    {ORDER_STATUS_LABELS[order.status as string]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
