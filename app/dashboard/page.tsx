import { UserProfile } from "@/components/user-profile"
import { UserReports } from "@/components/user-reports"
import { UserStats } from "@/components/user-stats"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Manage your profile and track your contributions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <UserProfile />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <UserStats />
          <UserReports />
        </div>
      </div>
    </div>
  )
}
