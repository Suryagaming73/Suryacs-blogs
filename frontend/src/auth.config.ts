import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const role = (auth?.user as any)?.role
      const isDashboard = nextUrl.pathname.startsWith('/dashboard')

      if (isDashboard) {
        if (!isLoggedIn) return false
        if (role !== 'admin') {
          return Response.redirect(new URL('/', nextUrl))
        }
        return true
      }
      return true
    },
    async session({ session, token }) {
      if (token) {
        ;(session.user as any).id = token.id as string
        ;(session.user as any).role = token.role as string
      }
      return session
    },
  },
  providers: [],
}
