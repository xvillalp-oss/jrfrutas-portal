'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ShoppingCart, Package, LayoutDashboard, LogOut, Leaf } from 'lucide-react'
import { useCart } from '@/components/cart/CartContext'
import type { Restaurant } from '@/types'
import { cn } from '@/lib/utils'

interface DashboardNavProps {
  restaurant: Restaurant
}

export function DashboardNav({ restaurant }: DashboardNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { totalItems, totalKg, setIsOpen } = useCart()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const links = [
    { href: '/dashboard', label: 'Inicio', icon: <LayoutDashboard size={16} /> },
    { href: '/dashboard/catalogo', label: 'Catálogo', icon: <Leaf size={16} /> },
    { href: '/dashboard/pedidos', label: 'Mis pedidos', icon: <Package size={16} /> },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-brand-700">
            <span className="text-xl">🌿</span>
            <span className="hidden sm:block">JR Frutas</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === l.href
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                {l.icon} {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-xs text-gray-500">Bienvenido,</p>
            <p className="text-sm font-semibold text-gray-800 truncate max-w-[160px]">
              {restaurant.business_name}
            </p>
          </div>

          {/* Cart button */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative bg-brand-600 text-white p-2 rounded-lg hover:bg-brand-700 transition-colors"
          >
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600 p-2">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex border-t border-gray-100">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              'flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors',
              pathname === l.href ? 'text-brand-600' : 'text-gray-500'
            )}
          >
            {l.icon}
            {l.label}
          </Link>
        ))}
      </div>
    </header>
  )
}
