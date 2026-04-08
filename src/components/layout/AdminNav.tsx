'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, Users, Package, Leaf, LogOut, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AdminNav({ adminEmail }: { adminEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const links = [
    { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { href: '/admin/clientes', label: 'Clientes', icon: <Users size={16} /> },
    { href: '/admin/pedidos', label: 'Pedidos', icon: <Package size={16} /> },
    { href: '/admin/catalogo', label: 'Catálogo', icon: <Leaf size={16} /> },
  ]

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-brand-400" />
            <span className="font-bold text-sm">Admin JR Frutas</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  pathname === l.href
                    ? 'bg-brand-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )}
              >
                {l.icon} {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 hidden sm:block">{adminEmail}</span>
          <button onClick={handleLogout} className="text-gray-400 hover:text-white p-1.5">
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex border-t border-gray-700">
        {links.map((l) => (
          <Link key={l.href} href={l.href}
            className={cn(
              'flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium',
              pathname === l.href ? 'text-brand-400' : 'text-gray-400'
            )}>
            {l.icon} {l.label}
          </Link>
        ))}
      </div>
    </header>
  )
}
