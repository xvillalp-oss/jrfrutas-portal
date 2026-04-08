'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/cart/CartContext'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatKg, MIN_WEEKLY_KG } from '@/lib/utils'
import { CheckCircle, Loader2, ArrowLeft, Truck } from 'lucide-react'
import Link from 'next/link'

export default function ConfirmarPedidoPage() {
  const router = useRouter()
  const { items, totalKg, clearCart } = useCart()
  const [deliveryDate, setDeliveryDate] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  const totalPrice = items.reduce((sum, i) => sum + i.quantity_kg * i.product.price_per_kg, 0)

  // Min delivery date: 2 days from now
  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 2)
  const minDateStr = minDate.toISOString().split('T')[0]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (totalKg < MIN_WEEKLY_KG) {
      setError(`El pedido mínimo es ${MIN_WEEKLY_KG} kg. Actualmente tienes ${totalKg} kg.`)
      return
    }
    if (!deliveryDate) {
      setError('Selecciona una fecha de entrega.')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('id, status')
      .eq('user_id', user.id)
      .single()

    if (!restaurant || restaurant.status !== 'approved') {
      setError('Tu cuenta no está aprobada aún.')
      setLoading(false)
      return
    }

    // Create order
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        restaurant_id: restaurant.id,
        delivery_date: deliveryDate,
        total_kg: totalKg,
        notes: notes || null,
        status: 'pending',
      })
      .select()
      .single()

    if (orderErr || !order) {
      setError('Error al crear el pedido. Intenta de nuevo.')
      setLoading(false)
      return
    }

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      quantity_kg: item.quantity_kg,
      unit_price: item.product.price_per_kg,
    }))

    const { error: itemsErr } = await supabase.from('order_items').insert(orderItems)

    if (itemsErr) {
      setError('Error al guardar los productos del pedido.')
      setLoading(false)
      return
    }

    setOrderNumber(order.order_number)
    setSuccess(true)
    clearCart()
    setLoading(false)
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto pt-12 text-center">
        <div className="card p-10">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-brand-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">¡Pedido enviado!</h2>
          <p className="text-brand-700 font-bold text-lg mb-3">{orderNumber}</p>
          <p className="text-gray-500 text-sm mb-6">
            Nuestro equipo revisará tu pedido y te confirmará en breve.
          </p>
          <Link href="/dashboard/pedidos" className="btn-primary w-full justify-center">
            Ver mis pedidos
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 mb-4">Tu carrito está vacío</p>
        <Link href="/dashboard/catalogo" className="btn-primary">← Ir al catálogo</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/catalogo" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Confirmar pedido</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {/* Order summary */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b bg-gray-50">
          <h2 className="font-bold text-gray-900">Resumen del pedido</h2>
        </div>
        <div className="divide-y max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div key={item.product.id} className="px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">{item.product.name}</p>
                <p className="text-xs text-gray-400">{item.quantity_kg} kg × {formatCurrency(item.product.price_per_kg)}/kg</p>
              </div>
              <p className="text-sm font-bold text-gray-900">
                {formatCurrency(item.quantity_kg * item.product.price_per_kg)}
              </p>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 border-t bg-gray-50 flex justify-between">
          <div>
            <p className="text-sm text-gray-500">Total kg</p>
            <p className="font-extrabold text-gray-900 text-lg">{formatKg(totalKg)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total estimado</p>
            <p className="font-extrabold text-brand-700 text-lg">{formatCurrency(totalPrice)}</p>
          </div>
        </div>
      </div>

      {/* Delivery form */}
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Truck size={18} className="text-brand-600" />
          <h2 className="font-bold text-gray-900">Detalles de entrega</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Fecha de entrega deseada *
          </label>
          <input
            type="date"
            className="input-field"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            min={minDateStr}
            required
          />
          <p className="text-xs text-gray-400 mt-1">Mínimo 2 días hábiles de anticipación</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Notas adicionales <span className="text-gray-400">(opcional)</span>
          </label>
          <textarea
            className="input-field resize-none"
            rows={3}
            placeholder="Horario preferido de entrega, instrucciones especiales..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="bg-brand-50 border border-brand-200 rounded-lg px-4 py-3 text-sm text-brand-700">
          💡 El pago se coordina directamente con nuestro equipo. Recibirás una confirmación por correo.
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? <Loader2 size={18} className="animate-spin" /> : null}
          {loading ? 'Enviando pedido...' : `Confirmar pedido · ${formatKg(totalKg)}`}
        </button>
      </form>
    </div>
  )
}
