import { AuthTabs } from "@/components/auth-tabs"

export default function AuthPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome</h1>
        <p className="text-muted-foreground">Sign in to your account or create a new one</p>
      </div>
      <AuthTabs />
    </div>
  )
}
