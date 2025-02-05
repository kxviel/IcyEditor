import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import Logo from '@/assets/Logo.svg'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export const Route = createLazyFileRoute('/forgot-password')({
  component: RouteComponent,
})

function RouteComponent() {
  const [email, setEmail] = useState<string>('')

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex h-full w-[376px] flex-col items-center gap-6 px-2 pt-40">
        <div>
          <img src={Logo} alt="logo" />
        </div>

        <p className="text-2xl font-semibold">Forgot Password?</p>
        <p className="text-lg text-gray-500">
          No worries, we’ll send you reset instructions.
        </p>

        <div className="w-full space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button className="w-full" type="submit" disabled={!email}>
          Reset Password
        </Button>

        <Link to="/login">
          <div className="flex items-center gap-2 text-sm">
            <ArrowLeft className="h-5 w-5" /> Back to Login
          </div>
        </Link>
      </div>
    </div>
  )
}
