"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RECENT_INSPECTIONS } from "@/lib/demo-data"
import Link from "next/link"
import { Search, Filter, ArrowUpDown } from "lucide-react"
import { useRole } from "@/lib/role-context"

function HistoryContent() {
  const { role } = useRole()
  const searchParams = useSearchParams()
  const filterParam = searchParams.get('filter')
  
  const [filter, setFilter] = useState(filterParam || 'all')

  const filteredInspections = RECENT_INSPECTIONS.filter(batch => {
    // Role-based filtering
    if (role === 'FARMER') {
      // For demo, pretend the logged-in farmer is "Suresh Farms" or filter out unknown
      if (batch.supplier === 'Unknown Supplier') return false;
      // In a real app, this would be strictly based on the auth user ID.
    }

    // Status filtering
    if (filter === 'pending') return batch.status === 'Pending Verification'
    if (filter === 'rejected') return batch.grade === 'Reject'
    return true
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inspection History</h1>
          <p className="text-slate-500">
            {role === 'FARMER' ? "View your past batch assessments." : "View and trace previous batch assessments."}
          </p>
        </div>
        {role === 'PROCUREMENT_OFFICER' && (
          <Link href="/inspection/new">
            <Button className="bg-green-600 hover:bg-green-700">New Inspection</Button>
          </Link>
        )}
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50/50 border-b pb-4 px-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search batch ID or supplier..." 
                className="w-full pl-9 pr-4 h-10 border rounded-md text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="h-10 border rounded-md px-3 text-sm outline-none bg-white focus:border-green-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending Review</option>
                <option value="rejected">Rejected</option>
              </select>
              <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase text-xs border-b">
                <tr>
                  <th className="px-6 py-4 font-medium flex items-center gap-1 cursor-pointer hover:text-slate-900">
                    Batch ID <ArrowUpDown className="w-3 h-3" />
                  </th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  {role !== 'FARMER' && <th className="px-6 py-4 font-medium">Supplier</th>}
                  <th className="px-6 py-4 font-medium">Grade</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInspections.map((batch) => (
                  <tr key={batch.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{batch.id}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(batch.date).toLocaleDateString()}</td>
                    {role !== 'FARMER' && <td className="px-6 py-4">{batch.supplier}</td>}
                    <td className="px-6 py-4">
                      <span className={`font-bold ${
                        batch.grade === 'A' ? 'text-green-600' :
                        batch.grade === 'B' ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        {batch.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {batch.status === 'Pending Verification' ? (
                        <Badge variant="warning" className="font-medium">Review Required</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-medium">Completed</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/inspection/result/${batch.id}`}>
                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                          View Report
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                
                {filteredInspections.length === 0 && (
                  <tr>
                    <td colSpan={role === 'FARMER' ? 5 : 6} className="px-6 py-12 text-center text-slate-500">
                      No inspections found matching the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading history...</div>}>
      <HistoryContent />
    </Suspense>
  )
}
