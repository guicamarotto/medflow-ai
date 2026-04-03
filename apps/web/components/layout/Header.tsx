import { auth, signOut } from '@/auth'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

interface HeaderProps {
  title: string
}

export async function Header({ title }: HeaderProps) {
  const session = await auth()

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-border">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        {session?.user && (
          <>
            <span className="text-sm text-muted-foreground">{session.user.name}</span>
            <form
              action={async () => {
                'use server'
                await signOut({ redirectTo: '/login' })
              }}
            >
              <Button variant="ghost" size="sm" type="submit">
                <LogOut className="w-4 h-4" />
                Sign out
              </Button>
            </form>
          </>
        )}
      </div>
    </header>
  )
}
