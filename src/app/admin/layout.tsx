import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/layout/AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Check if admin
  const adminDb = createAdminClient()
  const { data: adminUser } = await adminDb
    .from('admin_users')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!adminUser) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav adminEmail={user.email ?? ''} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
