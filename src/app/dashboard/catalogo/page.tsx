import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CatalogClient } from './CatalogClient'

export default async function CatalogoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('status')
    .eq('user_id', user!.id)
    .single()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  const { data: products } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('available', true)
    .order('name')

  return (
    <CatalogClient
      categories={categories ?? []}
      products={products ?? []}
      restaurantStatus={restaurant?.status ?? 'pending'}
    />
  )
}
