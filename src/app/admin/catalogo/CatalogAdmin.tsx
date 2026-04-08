'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Plus, Search, Edit2, Eye, EyeOff, Loader2, X, Save } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Product, Category } from '@/types'

const EMPTY_FORM = {
  name: '', category_id: '', description: '', unit: 'kg',
  price_per_kg: '', min_quantity_kg: '1', available: true, featured: false,
  image_url: '',
}

export function CatalogAdmin({ products, categories }: { products: Product[], categories: Category[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [toggling, setToggling] = useState<string | null>(null)

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  function openNew() {
    setForm(EMPTY_FORM)
    setEditProduct(null)
    setShowForm(true)
  }

  function openEdit(p: Product) {
    setForm({
      name: p.name,
      category_id: p.category_id,
      description: p.description ?? '',
      unit: p.unit,
      price_per_kg: String(p.price_per_kg),
      min_quantity_kg: String(p.min_quantity_kg),
      available: p.available,
      featured: p.featured,
      image_url: p.image_url ?? '',
    })
    setEditProduct(p)
    setShowForm(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const payload = {
      name: form.name,
      category_id: form.category_id,
      description: form.description || null,
      unit: form.unit,
      price_per_kg: parseFloat(form.price_per_kg),
      min_quantity_kg: parseFloat(form.min_quantity_kg),
      available: form.available,
      featured: form.featured,
      image_url: form.image_url || null,
    }

    if (editProduct) {
      await supabase.from('products').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editProduct.id)
    } else {
      await supabase.from('products').insert(payload)
    }

    setLoading(false)
    setShowForm(false)
    router.refresh()
  }

  async function toggleAvailable(p: Product) {
    setToggling(p.id)
    const supabase = createClient()
    await supabase.from('products').update({ available: !p.available }).eq('id', p.id)
    setToggling(null)
    router.refresh()
  }

  function upd(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-9" placeholder="Buscar productos..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button onClick={openNew} className="btn-primary">
          <Plus size={16} /> Agregar producto
        </button>
      </div>

      {/* Products table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="text-left px-5 py-3">Producto</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">Categoría</th>
              <th className="text-right px-4 py-3">Precio/kg</th>
              <th className="text-right px-4 py-3 hidden md:table-cell">Mín. kg</th>
              <th className="text-center px-4 py-3">Estado</th>
              <th className="text-right px-5 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((p) => (
              <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${!p.available ? 'opacity-50' : ''}`}>
                <td className="px-5 py-3">
                  <div>
                    <p className="font-semibold text-gray-900">{p.name}</p>
                    {p.featured && <span className="text-xs text-accent-500 font-medium">★ Destacado</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                  {(p as any).categories?.name ?? '—'}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-brand-700">
                  {formatCurrency(p.price_per_kg)}
                </td>
                <td className="px-4 py-3 text-right text-gray-500 hidden md:table-cell">
                  {p.min_quantity_kg} kg
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => toggleAvailable(p)} disabled={toggling === p.id}
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full transition-colors ${
                      p.available ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}>
                    {toggling === p.id ? <Loader2 size={11} className="animate-spin" /> : p.available ? <Eye size={11} /> : <EyeOff size={11} />}
                    {p.available ? 'Activo' : 'Oculto'}
                  </button>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-brand-600 p-1.5">
                    <Edit2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-10 text-center text-gray-400 text-sm">Sin productos</div>
        )}
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                {editProduct ? 'Editar producto' : 'Nuevo producto'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre *</label>
                  <input className="input-field" value={form.name} onChange={(e) => upd('name', e.target.value)} required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoría *</label>
                  <select className="input-field" value={form.category_id} onChange={(e) => upd('category_id', e.target.value)} required>
                    <option value="">Selecciona...</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Precio por kg *</label>
                  <input type="number" step="0.01" min="0" className="input-field" value={form.price_per_kg}
                    onChange={(e) => upd('price_per_kg', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mínimo kg *</label>
                  <input type="number" step="0.5" min="0.5" className="input-field" value={form.min_quantity_kg}
                    onChange={(e) => upd('min_quantity_kg', e.target.value)} required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">URL de imagen <span className="text-gray-400">(opcional)</span></label>
                  <input className="input-field" placeholder="https://ejemplo.com/imagen.jpg"
                    value={form.image_url} onChange={(e) => upd('image_url', e.target.value)} />
                  {form.image_url && (
                    <img src={form.image_url} alt="preview" className="mt-2 h-20 w-20 object-cover rounded-lg border" />
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
                  <textarea className="input-field resize-none" rows={2} value={form.description}
                    onChange={(e) => upd('description', e.target.value)} />
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.available} onChange={(e) => upd('available', e.target.checked)}
                    className="rounded text-brand-600" />
                  Disponible
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => upd('featured', e.target.checked)}
                    className="rounded text-brand-600" />
                  Destacado
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
