import Link from 'next/link'
import { CheckCircle, Truck, Star, Phone, MapPin, Clock, Package, Leaf, ArrowRight, ChevronRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* NAV */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="font-bold text-xl text-brand-700">JR Frutas</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#como-funciona" className="hover:text-brand-600 transition-colors">¿Cómo funciona?</a>
            <a href="#productos" className="hover:text-brand-600 transition-colors">Productos</a>
            <a href="#nosotros" className="hover:text-brand-600 transition-colors">Nosotros</a>
            <a href="#contacto" className="hover:text-brand-600 transition-colors">Contacto</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-semibold text-gray-700 hover:text-brand-600 transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/auth/registro" className="btn-primary text-sm py-2 px-4">
              Registrar restaurante
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-16 min-h-screen flex items-center bg-gradient-to-br from-brand-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                <Leaf size={14} />
                Más de 40 años en el campo
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                El campo directo{' '}
                <span className="text-brand-600">a tu cocina</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Frutas y verduras frescas de calidad garantizada, entregadas en tu restaurante en CDMX y Estado de México.
                Un solo proveedor, 200+ productos, sin complicaciones.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/registro" className="btn-primary text-base py-3 px-6">
                  Quiero ser cliente <ArrowRight size={18} />
                </Link>
                <a href="#como-funciona" className="btn-secondary text-base py-3 px-6">
                  ¿Cómo funciona?
                </a>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Pedido mínimo: 400 kg/semana · Entrega en CDMX y Edo. Mex.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🍅', label: 'Verduras', count: '80+' },
                { icon: '🍓', label: 'Frutas', count: '60+' },
                { icon: '🍊', label: 'Cítricos', count: '15+' },
                { icon: '🌿', label: 'Hierbas', count: '40+' },
              ].map((cat) => (
                <div key={cat.label} className="card p-6 text-center hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-2">{cat.icon}</div>
                  <div className="font-bold text-2xl text-brand-600">{cat.count}</div>
                  <div className="text-gray-600 text-sm font-medium">{cat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-brand-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: '+40', label: 'Años de experiencia' },
              { value: '200+', label: 'Productos disponibles' },
              { value: '9', label: 'Estados productores' },
              { value: '2', label: 'Zonas de entrega' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-extrabold mb-1">{stat.value}</div>
                <div className="text-brand-200 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">¿Cómo funciona?</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              En 3 pasos tienes frutas y verduras frescas en tu restaurante cada semana.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <CheckCircle size={28} className="text-brand-600" />,
                title: 'Regístrate',
                desc: 'Crea tu cuenta con los datos de tu restaurante. Nuestro equipo revisa tu solicitud en menos de 24 horas.',
              },
              {
                step: '02',
                icon: <Package size={28} className="text-brand-600" />,
                title: 'Elige tu pedido',
                desc: 'Explora nuestro catálogo de 200+ productos. Agrega lo que necesitas al carrito y confirma tu pedido semanal.',
              },
              {
                step: '03',
                icon: <Truck size={28} className="text-brand-600" />,
                title: 'Recibe en tu puerta',
                desc: 'Coordinamos la entrega directa a tu restaurante en CDMX o Estado de México en tiempo récord.',
              },
            ].map((item) => (
              <div key={item.step} className="card p-8 relative">
                <div className="absolute top-6 right-6 text-5xl font-black text-gray-50 select-none">
                  {item.step}
                </div>
                <div className="bg-brand-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section id="productos" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Nuestros productos</h2>
            <p className="text-xl text-gray-500">
              Más de 200 productos frescos directamente del campo.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { emoji: '🥦', name: 'Brócoli', cat: 'Verduras' },
              { emoji: '🍅', name: 'Jitomate', cat: 'Verduras' },
              { emoji: '🥭', name: 'Mango Ataulfo', cat: 'Tropicales' },
              { emoji: '🍓', name: 'Fresa', cat: 'Frutas' },
              { emoji: '🍋', name: 'Limón Persa', cat: 'Cítricos' },
              { emoji: '🥑', name: 'Aguacate Hass', cat: 'Tropicales' },
              { emoji: '🌿', name: 'Cilantro', cat: 'Hierbas' },
              { emoji: '🧅', name: 'Cebolla', cat: 'Verduras' },
              { emoji: '🍊', name: 'Naranja', cat: 'Cítricos' },
              { emoji: '🫑', name: 'Chile Poblano', cat: 'Verduras' },
            ].map((p) => (
              <div key={p.name} className="card p-4 text-center hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">{p.emoji}</div>
                <div className="font-semibold text-sm text-gray-800">{p.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{p.cat}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/auth/registro" className="btn-primary">
              Ver catálogo completo <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* POR QUÉ JR FRUTAS */}
      <section id="nosotros" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
                ¿Por qué elegirnos?
              </h2>
              <div className="space-y-5">
                {[
                  {
                    icon: <Star className="text-accent-500" size={20} />,
                    title: 'Calidad garantizada',
                    desc: 'Seleccionamos cada producto antes de que llegue a tu cocina. Sin sorpresas.',
                  },
                  {
                    icon: <Truck className="text-brand-600" size={20} />,
                    title: 'Logística propia',
                    desc: 'Red de distribución nacional: del campo al CEDA y directo a ti en tiempos récord.',
                  },
                  {
                    icon: <Package className="text-brand-600" size={20} />,
                    title: 'Un solo proveedor',
                    desc: 'Más de 200 productos en un solo pedido. Sin lidiar con múltiples proveedores.',
                  },
                  {
                    icon: <Clock className="text-brand-600" size={20} />,
                    title: '40 años de experiencia',
                    desc: 'Somos proveedores de Walmart, La Comer, Soriana y empresas institucionales.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="bg-brand-50 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{item.title}</div>
                      <div className="text-gray-500 text-sm mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-8 bg-brand-50 border-brand-200">
              <h3 className="text-2xl font-bold text-brand-800 mb-2">¿Listo para empezar?</h3>
              <p className="text-brand-700 mb-6">
                Regístrate hoy. Tu solicitud es revisada en menos de 24 horas.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Catálogo de 200+ productos disponible 24/7',
                  'Pedidos semanales con mínimo 400 kg',
                  'Entrega en CDMX y Estado de México',
                  'Precios de mayoreo sin intermediarios',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-brand-700 text-sm">
                    <CheckCircle size={16} className="text-brand-600 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/registro" className="btn-primary w-full justify-center">
                Registrar mi restaurante <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Phone size={24} className="mx-auto mb-3 text-brand-400" />
              <div className="font-semibold">Teléfono</div>
              <div className="text-gray-400 text-sm mt-1">Lunes a viernes 8am–6pm</div>
            </div>
            <div>
              <MapPin size={24} className="mx-auto mb-3 text-brand-400" />
              <div className="font-semibold">Cobertura</div>
              <div className="text-gray-400 text-sm mt-1">CDMX y Estado de México</div>
            </div>
            <div>
              <Leaf size={24} className="mx-auto mb-3 text-brand-400" />
              <div className="font-semibold">JR Frutas</div>
              <div className="text-gray-400 text-sm mt-1">Más de 40 años en el mercado</div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} JR Frutas. Todos los derechos reservados.
          </div>
        </div>
      </section>

    </div>
  )
}
