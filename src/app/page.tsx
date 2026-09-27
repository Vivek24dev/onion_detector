"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useRole } from "@/lib/role-context"
import { UserRole } from "@/lib/types"

export default function LoginPage() {
  const router = useRouter()
  const { setRole } = useRole()
  const [selectedRole, setSelectedRole] = useState<UserRole>('PROCUREMENT_OFFICER')

  const handleLogin = () => {
    setRole(selectedRole)
    router.push('/dashboard')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="mb-8 flex items-center gap-3">
        <div className="bg-green-100 p-3 rounded-full">
          <Leaf className="w-10 h-10 text-green-700" />
        </div>
        <h1 className="text-4xl font-extrabold text-green-800 tracking-tight">AgriQ</h1>
      </div>
      
      <Card className="w-full max-w-md shadow-lg border-green-100">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold text-center">System Login</CardTitle>
          <CardDescription className="text-center">
            AI-based Onion Quality Assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">User Role</label>
            <select 
              className="w-full border rounded-md h-10 px-3 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
            >
              <option value="PROCUREMENT_OFFICER">Procurement Officer</option>
              <option value="QUALITY_INSPECTOR">Quality Inspector</option>
              <option value="FARMER">Farmer / Supplier</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input type="password" placeholder="••••••••" className="w-full border rounded-md h-10 px-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" defaultValue="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-lg py-6 shadow-md transition-all"
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </CardFooter>
      </Card>
      
      <p className="mt-8 text-sm text-slate-500">
        SIH 2024 Prototype • Problem Statement 26031
      </p>
    </div>
  )
}
