import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Initialize the Supabase Edge client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Fetch the secure user session
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // 1. Allow public routes
  if (path === '/' || path.startsWith('/login')) {
    // Optional polish: If they are already logged in and try to visit /login, 
    // redirect them to their respective dashboard.
    if (user) {
        const role = user.user_metadata?.requested_role || 'patient'
        return NextResponse.redirect(new URL(`/${role}`, request.url))
    }
    return supabaseResponse
  }

  // 2. Protect everything else - kick to login if no session
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 3. Role-Based Access Control (RBAC)
  // Assumes you stored the role in user_metadata during the signup flow
  const role = user.user_metadata?.requested_role || 'patient'

  // Block patients from viewing the doctor triage dashboard
  if (path.startsWith('/doctor') && role !== 'doctor') {
    return NextResponse.redirect(new URL('/patient', request.url))
  }

  // Optional: Block doctors from the patient portal to keep workflows clean
  if (path.startsWith('/patient') && role !== 'patient') {
    return NextResponse.redirect(new URL('/doctor', request.url))
  }

  return supabaseResponse
}

// 4. Configure the Matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more static assets if needed.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
