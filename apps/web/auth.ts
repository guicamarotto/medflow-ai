import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'

// Hardcoded doctor credentials for PoC
// In production: replace with database lookup + bcrypt
const DEMO_USERS = [
  {
    id: '1',
    name: 'Dr. Alex Morgan',
    email: 'doctor@medflow.demo',
    password: 'demo1234',
    role: 'doctor',
  },
]

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = DEMO_USERS.find(
          (u) => u.email === parsed.data.email && u.password === parsed.data.password
        )

        if (!user) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as typeof user & { role: string }).role
      return token
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & { role: string }).role = token.role as string
      }
      return session
    },
  },
})
