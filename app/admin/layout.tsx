import { getAdminUser } from '@/lib/auth'
import AdminLayoutClient from '@/components/ui/AdminLayoutClient'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminUser()
  if (!admin) {
    return <>{children}</>
  }
  return <AdminLayoutClient admin={{ name: admin.name, role: admin.role }}>{children}</AdminLayoutClient>
}
