'use client'
import { useState, useMemo } from 'react'
import { Search, Filter, ShoppingCart, Lock } from 'lucide-react'
import { ProductCard } from '@/components/catalog/ProductCard'
import { useCart } from '@/components/cart/CartContext'
import { MIN_WEEKLY_KG, formatKg } from '@/lib/utils'
import type { Product, Category } from '@/types'

interface CatalogClientProps {
  categories: Category[]
  products: Product[]
  restaurantStatus: string
}

export function CatalogClient({ categories, products, restaurantStatus }: CatalogClientProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const { totalKg, totalItems, setIsOpen } = useCart()

  const isApproved = restaurantStatus === 'approved'

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchCat = activeCategory === 'all' || p.category_id === activeCategory
      return matchSearch && matchCat
    })
  }, [products, search, activeCategory])

  const progress = Math.min((totalKg / MIN_WEEKLY_KG) * 100, 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Catálogo</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} productos disponibles</p>
        </div>
        {totalItems > 0 && (
          <button onClick={() => setIsOpen(true)} className="btn-primary">
            <ShoppingCart size={16} />
            Ver carrito · {formatKg(totalKg)}
          </button>
        )}
      </div>

      {/* Pending notice */}
      {!isApproved && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <Lock size={18} className="text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-700">
            <strong>Cuenta en revisión.</strong> Puedes explorar el catálogo, pero para hacer pedidos necesitas que tu cuenta sea aprobada.
          </p>
        </div>
      )}

      {/* Progress bar */}
      {isApproved && totalKg > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Progreso del pedido semanal</span>
            <span className={`font-bold ${totalKg >= MIN_WEEKLY_KG ? 'text-brand-600' : 'text-amber-600'}`}>
              {formatKg(totalKg)} / {formatKg(MIN_WEEKLY_KG)}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${totalKg >= MIN_WEEKLY_KG ? 'bg-brand-500' : 'bg-amber-400'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          {totalKg >= MIN_WEEKLY_KG && (
            <p className="text-xs text-brand-600 font-semibold mt-1.5">✓ Mínimo alcanzado — puedes confirmar tu pedido</p>
          )}
        </div>
      )}

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
              activeCategory === 'all'
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                activeCategory === cat.id
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">No se encontraron productos</p>
          <p className="text-sm mt-1">Intenta con otro término de búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
