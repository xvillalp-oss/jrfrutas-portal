import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CartProvider } from '@/components/cart/CartContext'
import { CartSidebar } from '@/components/cart/CartSidebar'
import { DashboardNav } from '@/components/layout/DashboardNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!restaurant) redirect('/auth/registro')

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <DashboardNav restaurant={restaurant} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <CartSidebar />
      </div>
    </CartProvider>
  )
}
