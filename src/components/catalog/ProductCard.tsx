'use client'
import { useState } from 'react'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { useCart } from '@/components/cart/CartContext'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

const CATEGORY_EMOJIS: Record<string, string> = {
  frutas: '🍎',
  verduras: '🥦',
  citricos: '🍊',
  hierbas: '🌿',
  tropicales: '🍍',
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCart()
  const [qty, setQty] = useState(product.min_quantity_kg)
  const cartItem = items.find((i) => i.product.id === product.id)

  function handleAdd() {
    addItem(product, qty)
    setQty(product.min_quantity_kg)
  }

  const emoji = CATEGORY_EMOJIS[product.categories?.slug ?? ''] ?? '🌿'

  return (
    <div className="card p-4 hover:shadow-md transition-shadow flex flex-col">
      {/* Image / Emoji */}
      <div className="bg-gradient-to-br from-brand-50 to-green-50 rounded-lg h-28 flex items-center justify-center mb-3 text-4xl relative overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
              ;(e.target as HTMLImageElement).nextElementSibling?.removeAttribute('style')
            }}
          />
        ) : null}
        <span style={product.image_url ? { display: 'none' } : {}}>{emoji}</span>
        {cartItem && (
          <span className="absolute top-1.5 right-1.5 bg-brand-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full z-10">
            {cartItem.quantity_kg}kg
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <p className="font-semibold text-sm text-gray-900 leading-tight">{product.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{product.categories?.name}</p>
        <p className="text-brand-700 font-bold mt-1.5">
          {formatCurrency(product.price_per_kg)}<span className="text-gray-400 font-normal text-xs">/kg</span>
        </p>
        <p className="text-xs text-gray-400">Mínimo: {product.min_quantity_kg} kg</p>
      </div>

      {/* Qty + Add */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setQty(Math.max(product.min_quantity_kg, qty - 1))}
            className="px-2.5 py-1.5 hover:bg-gray-50 text-gray-500"
          >
            <Minus size={12} />
          </button>
          <span className="px-2 text-sm font-semibold text-gray-800 min-w-[36px] text-center">{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            className="px-2.5 py-1.5 hover:bg-gray-50 text-gray-500"
          >
            <Plus size={12} />
          </button>
        </div>
        <button
          onClick={handleAdd}
          className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
        >
          <ShoppingCart size={13} /> Agregar
        </button>
      </div>
    </div>
  )
}
