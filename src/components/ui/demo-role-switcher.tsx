"use client"

import { useRole } from "@/lib/role-context"
import { UserRole } from "@/lib/types"

export function DemoRoleSwitcher() {
  const { role, setRole } = useRole()

  return (
    <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200">
      <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Demo Role:</span>
      <select 
        value={role} 
        onChange={(e) => setRole(e.target.value as UserRole)}
        className="text-xs bg-transparent border-none text-purple-900 font-medium outline-none cursor-pointer"
      >
        <option value="PROCUREMENT_OFFICER">Procurement Officer</option>
        <option value="QUALITY_INSPECTOR">Quality Inspector</option>
        <option value="FARMER">Farmer / Supplier</option>
      </select>
    </div>
  )
}
