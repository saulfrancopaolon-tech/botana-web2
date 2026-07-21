import { createClient } from '@supabase/supabase-js'

// ⚠️ Este cliente usa la SERVICE ROLE KEY y puede saltarse las reglas de
// seguridad (RLS). NUNCA lo importes desde un componente "use client" ni
// desde código que se envíe al navegador. Solo se usa dentro de las rutas
// de /app/api/staff/*, que corren en el servidor.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!serviceRoleKey && process.env.NODE_ENV !== 'production') {
  console.warn(
    '[supabase-admin] Falta SUPABASE_SERVICE_ROLE_KEY en las variables de entorno.'
  )
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
})
