import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      email, password,
      business_name, contact_name, phone,
      address, municipality, city, rfc, restaurant_type,
    } = body

    const db = createAdminClient()

    // 1. Create auth user via admin (no email confirmation needed)
    const { data: authData, error: authError } = await db.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // skip email confirmation
    })

    if (authError || !authData.user) {
      if (authError?.message?.includes('already registered') || authError?.message?.includes('already been registered')) {
        return NextResponse.json({ error: 'Ya existe una cuenta con ese correo.' }, { status: 400 })
      }
      return NextResponse.json({ error: authError?.message ?? 'Error al crear cuenta.' }, { status: 400 })
    }

    // 2. Create restaurant profile using service role (bypasses RLS)
    const { error: profileError } = await db.from('restaurants').insert({
      user_id: authData.user.id,
      business_name,
      contact_name,
      phone,
      email,
      address,
      municipality,
      city,
      rfc: rfc || null,
      restaurant_type: restaurant_type || null,
      status: 'pending',
    })

    if (profileError) {
      // Rollback: delete auth user if profile creation fails
      await db.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: 'Error al guardar perfil.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error inesperado.' }, { status: 500 })
  }
}
