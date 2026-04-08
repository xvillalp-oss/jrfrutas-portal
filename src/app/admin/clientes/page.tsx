import { createAdminClient } from '@/lib/supabase/server'
import { ClientsTable } from './ClientsTable'

export default async function ClientesPage() {
  const db = createAdminClient()
  const { data: restaurants } = await db
    .from('restaurants')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Clientes</h1>
        <p className="text-gray-500 text-sm mt-1">{restaurants?.length ?? 0} restaurantes registrados</p>
      </div>
      <ClientsTable restaurants={restaurants ?? []} />
    </div>
  )
}
