'use client'
import { createContext, useContext, useState, useCallback } from 'react'
import type { CartItem, Product } from '@/types'

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, qty: number) => void
  updateItem: (productId: string, qty: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  totalKg: number
  totalItems: number
  isOpen: boolean
  setIsOpen: (v: boolean) => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = useCallback((product: Product, qty: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity_kg: i.quantity_kg + qty }
            : i
        )
      }
      return [...prev, { product, quantity_kg: qty }]
    })
    setIsOpen(true)
  }, [])

  const updateItem = useCallback((productId: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.product.id !== productId)
        : prev.map((i) => i.product.id === productId ? { ...i, quantity_kg: qty } : i)
    )
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalKg = items.reduce((sum, i) => sum + i.quantity_kg, 0)
  const totalItems = items.length

  return (
    <CartContext.Provider value={{
      items, addItem, updateItem, removeItem, clearCart,
      totalKg, totalItems, isOpen, setIsOpen,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
