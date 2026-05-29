import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // Create an unmodified response that we can modify cookies on
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key-placeholder-anon-key-placeholder-anon-key-placeholder-anon-key';

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
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

  // Verify user session securely against the Supabase database.
  // getUser() validates the JWT on the Supabase Auth server and does not require email confirmation.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname;

  // Protect patient and doctor workspace dashboard routes
  const isDashboardRoute = path.startsWith('/patient') || path.startsWith('/doctor');
  const isLoginRoute = path === '/login';

  if (!user && isDashboardRoute) {
    // Force unauthenticated requests back to the login gateway
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isLoginRoute) {
    // Seamless routing for active authenticated session
    const role = user.user_metadata?.role || 'patient';
    const url = request.nextUrl.clone()
    url.pathname = `/${role}`
    return NextResponse.redirect(url)
  }

  return supabaseResponse;
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
