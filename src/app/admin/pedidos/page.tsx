import { createAdminClient } from '@/lib/supabase/server'
import { OrdersTable } from './OrdersTable'

export default async function AdminPedidosPage() {
  const db = createAdminClient()
  const { data: orders } = await db
    .from('orders')
    .select('*, restaurants(business_name, city, phone), order_items(*, products(name))')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Pedidos</h1>
        <p className="text-gray-500 text-sm mt-1">{orders?.length ?? 0} pedidos en total</p>
      </div>
      <OrdersTable orders={orders ?? []} />
    </div>
  )
}
