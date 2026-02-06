import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('currentUser')?.value
  const { pathname } = request.nextUrl

  let user = null
  if (currentUser) {
    try {
      user = JSON.parse(currentUser)
    } catch (e) {
      // Cookie invalide, on le supprime
      const response = NextResponse.redirect(new URL('/signin', request.url))
      response.cookies.delete('currentUser')
      return response
    }
  }

  // Routes publiques (accessibles sans connexion)
  const publicRoutes = ['/', '/signin', '/signup']
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Si pas connecté, rediriger vers /signin
  if (!user) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // PROTECTION : Admin ne peut PAS accéder aux pages candidat
  const candidatOnlyRoutes = [
    '/candidature-spontanee',
    '/candidat',
    '/candidat/auto-evaluation',
    '/candidat/offres',
    '/candidat/profil',
    '/candidat/mes-candidatures'
  ]

  if (user.role === 'admin' && candidatOnlyRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // PROTECTION : Candidat ne peut PAS accéder aux pages admin
  if (user.role === 'candidat' && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/candidat', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}