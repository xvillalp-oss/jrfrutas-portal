'use client'
import { useCart } from './CartContext'
import { X, Trash2, ShoppingCart, Minus, Plus } from 'lucide-react'
import { formatCurrency, formatKg, MIN_WEEKLY_KG } from '@/lib/utils'
import Link from 'next/link'

export function CartSidebar() {
  const { items, isOpen, setIsOpen, updateItem, removeItem, totalKg, totalItems } = useCart()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-brand-600" />
            <span className="font-bold text-gray-900">Carrito</span>
            {totalItems > 0 && (
              <span className="bg-brand-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ShoppingCart size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Tu carrito está vacío</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatCurrency(item.product.price_per_kg)}/kg
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-gray-300 hover:text-red-500 p-1 flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateItem(item.product.id, item.quantity_kg - 1)}
                      className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-semibold w-16 text-center">{item.quantity_kg} kg</span>
                    <button
                      onClick={() => updateItem(item.product.id, item.quantity_kg + 1)}
                      className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-brand-700">
                    {formatCurrency(item.product.price_per_kg * item.quantity_kg)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-5 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total kg</span>
              <span className="font-bold text-gray-900">{formatKg(totalKg)}</span>
            </div>

            {totalKg < MIN_WEEKLY_KG && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700">
                Mínimo semanal: {MIN_WEEKLY_KG} kg. Te faltan{' '}
                <strong>{MIN_WEEKLY_KG - totalKg} kg</strong> para completar el pedido.
              </div>
            )}

            <Link
              href="/dashboard/catalogo/confirmar"
              onClick={() => setIsOpen(false)}
              className={`btn-primary w-full justify-center ${totalKg < MIN_WEEKLY_KG ? 'opacity-50 pointer-events-none' : ''}`}
            >
              Confirmar pedido ({formatKg(totalKg)})
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
