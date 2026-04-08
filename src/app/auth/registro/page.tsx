'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle, Loader2 } from 'lucide-react'

const RESTAURANT_TYPES = [
  'Restaurante fine dining',
  'Restaurante casual',
  'Restaurante de comida rápida',
  'Cafetería / Café',
  'Hotel',
  'Catering',
  'Cocina industrial',
  'Otro',
]

export default function RegistroPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    business_name: '',
    contact_name: '',
    phone: '',
    address: '',
    municipality: '',
    city: 'CDMX' as 'CDMX' | 'Estado de Mexico',
    rfc: '',
    restaurant_type: '',
  })

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.passwordConfirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    setLoading(true)

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        business_name: form.business_name,
        contact_name: form.contact_name,
        phone: form.phone,
        address: form.address,
        municipality: form.municipality,
        city: form.city,
        rfc: form.rfc || null,
        restaurant_type: form.restaurant_type || null,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Ocurrió un error. Intenta de nuevo.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white flex items-center justify-center px-4">
        <div className="card p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-brand-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Solicitud enviada!</h2>
          <p className="text-gray-500 mb-6">
            Revisaremos tu solicitud en las próximas <strong>24 horas</strong>.
            Te notificaremos cuando tu cuenta esté activa.
          </p>
          <Link href="/auth/login" className="btn-primary w-full justify-center">
            Ir al inicio de sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-brand-700 font-bold text-2xl">
            <span className="text-3xl">🌿</span> JR Frutas
          </Link>
          <p className="text-gray-500 mt-2">Registro de restaurante</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                ${step >= s ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {s}
              </div>
              <span className={`text-sm font-medium ${step >= s ? 'text-brand-600' : 'text-gray-400'}`}>
                {s === 1 ? 'Datos de acceso' : 'Datos del restaurante'}
              </span>
              {s < 2 && <div className={`h-0.5 flex-1 ${step > s ? 'bg-brand-400' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="card p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2) } : handleSubmit}
            className="space-y-4">

            {step === 1 && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Datos de acceso</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo electrónico</label>
                  <input type="email" className="input-field" placeholder="chef@restaurante.com"
                    value={form.email} onChange={(e) => update('email', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
                  <input type="password" className="input-field" placeholder="Mínimo 8 caracteres"
                    value={form.password} onChange={(e) => update('password', e.target.value)} required minLength={8} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar contraseña</label>
                  <input type="password" className="input-field" placeholder="Repite tu contraseña"
                    value={form.passwordConfirm} onChange={(e) => update('passwordConfirm', e.target.value)} required />
                </div>
                <button type="submit" className="btn-primary w-full justify-center mt-2">
                  Continuar →
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Datos del restaurante</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre del negocio *</label>
                    <input type="text" className="input-field" placeholder="Restaurante El Buen Sabor"
                      value={form.business_name} onChange={(e) => update('business_name', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre de contacto *</label>
                    <input type="text" className="input-field" placeholder="Juan Pérez"
                      value={form.contact_name} onChange={(e) => update('contact_name', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono *</label>
                    <input type="tel" className="input-field" placeholder="55 1234 5678"
                      value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Dirección de entrega *</label>
                    <input type="text" className="input-field" placeholder="Calle, número, colonia"
                      value={form.address} onChange={(e) => update('address', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Alcaldía / Municipio *</label>
                    <input type="text" className="input-field" placeholder="Cuauhtémoc"
                      value={form.municipality} onChange={(e) => update('municipality', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Ciudad *</label>
                    <select className="input-field" value={form.city} onChange={(e) => update('city', e.target.value)}>
                      <option value="CDMX">CDMX</option>
                      <option value="Estado de Mexico">Estado de México</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">RFC <span className="text-gray-400">(opcional)</span></label>
                    <input type="text" className="input-field" placeholder="XAXX010101000"
                      value={form.rfc} onChange={(e) => update('rfc', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de restaurante</label>
                    <select className="input-field" value={form.restaurant_type} onChange={(e) => update('restaurant_type', e.target.value)}>
                      <option value="">Selecciona...</option>
                      {RESTAURANT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="bg-brand-50 border border-brand-200 rounded-lg px-4 py-3 text-sm text-brand-700 mt-2">
                  Pedido mínimo semanal: <strong>400 kg</strong>. Al registrarte aceptas este compromiso.
                </div>

                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center">
                    ← Atrás
                  </button>
                  <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                    {loading ? 'Enviando...' : 'Enviar solicitud'}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="text-brand-600 font-semibold hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
