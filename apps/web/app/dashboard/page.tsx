import { Header } from '@/components/layout/Header'
import { PatientQueue } from '@/components/patients/PatientQueue'

export const dynamic = 'force-dynamic'

async function getPatients() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
  const res = await fetch(`${apiUrl}/patients?sortBy=urgency`, {
    cache: 'no-store',
  })
  if (!res.ok) return []
  return res.json()
}

export default async function DashboardPage() {
  const patients = await getPatients()

  return (
    <>
      <Header title="Patient Queue" />
      <main className="flex-1 overflow-y-auto p-6">
        <PatientQueue patients={patients} />
      </main>
    </>
  )
}
