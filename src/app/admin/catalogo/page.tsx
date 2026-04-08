import { createAdminClient } from '@/lib/supabase/server'
import { CatalogAdmin } from './CatalogAdmin'

export default async function AdminCatalogoPage() {
  const db = createAdminClient()
  const [{ data: products }, { data: categories }] = await Promise.all([
    db.from('products').select('*, categories(*)').order('name'),
    db.from('categories').select('*').order('name'),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Catálogo de productos</h1>
        <p className="text-gray-500 text-sm mt-1">{products?.length ?? 0} productos registrados</p>
      </div>
      <CatalogAdmin products={products ?? []} categories={categories ?? []} />
    </div>
  )
}
