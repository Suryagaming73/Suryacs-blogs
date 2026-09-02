import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const email = credentials.email as string
        const password = credentials.password as string
        if (!email || !password) return null

        const user = await db.select().from(users).where(eq(users.email, email)).get()
        if (!user || !user.passwordHash) return null

        const valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          image: user.avatarUrl,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const existing = await db
          .select({ id: users.id, role: users.role })
          .from(users)
          .where(eq(users.email, user.email!))
          .get()

        if (!existing) {
          const newId = crypto.randomUUID()
          const baseUsername = user.name?.toLowerCase().replace(/\s+/g, '_') || user.email!.split('@')[0]
          const isAdmin = user.email!.toLowerCase() === 'cssurya2006@gmail.com'
          await db.insert(users).values({
            id: newId,
            email: user.email!,
            username: baseUsername,
            role: isAdmin ? 'admin' : 'viewer',
            avatarUrl: user.image ?? null,
          })
          ;(user as any).id = newId
          ;(user as any).role = isAdmin ? 'admin' : 'viewer'
        } else {
          let role = existing.role
          if (user.email!.toLowerCase() === 'cssurya2006@gmail.com' && role !== 'admin') {
            await db.update(users).set({ role: 'admin' }).where(eq(users.id, existing.id)).run()
            role = 'admin'
          }
          ;(user as any).id = existing.id
          ;(user as any).role = role
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
        token.role = (user as any).role ?? 'viewer'
      }
      return token
    },
    async session({ session, token }) {
      ;(session.user as any).id = token.id as string
      ;(session.user as any).role = token.role as string
      return session
    },
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
})
