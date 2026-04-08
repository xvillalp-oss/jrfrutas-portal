import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JR Frutas — Portal de Restaurantes',
  description: 'Plataforma de pedidos B2B de frutas y verduras frescas para restaurantes en CDMX y Estado de México.',
  keywords: 'frutas, verduras, mayoreo, restaurantes, CDMX, proveedor',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
