"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, ClipboardList, CheckCircle2, XCircle, AlertCircle, FileText } from "lucide-react"
import Link from "next/link"
import { RECENT_INSPECTIONS } from "@/lib/demo-data"
import { useRole } from "@/lib/role-context"

export default function DashboardPage() {
  const { role } = useRole()
  
  const stats = {
    total: 142,
    gradeA: 85,
    gradeB: 42,
    rejected: 15,
    pending: 3
  }

  const renderProcurementDashboard = () => (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inspected</CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-slate-500">batches this month</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grade A Batches</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.gradeA}</div>
            <p className="text-xs text-slate-500">{(stats.gradeA/stats.total*100).toFixed(0)}% of total</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-xs text-slate-500">Requires supplier feedback</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-slate-500">Manual verification needed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-slate-200">
          <CardHeader>
            <CardTitle>Recent Inspections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RECENT_INSPECTIONS.map((batch) => (
                <div key={batch.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{batch.id}</span>
                      {batch.status === 'Pending Verification' ? (
                        <Badge variant="warning" className="text-[10px]">Review Required</Badge>
                      ) : (
                        <Badge variant={
                          batch.grade === 'A' ? 'success' : 
                          batch.grade === 'B' ? 'default' : 'destructive'
                        } className="text-[10px]">
                          Grade {batch.grade}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">{batch.supplier} • {new Date(batch.date).toLocaleDateString()}</span>
                  </div>
                  <Link href={`/inspection/result/${batch.id}`}>
                    <Button variant="outline" size="sm">View Report</Button>
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/history">
                <Button variant="ghost" className="w-full text-sm text-green-600">View all history</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-slate-200 bg-green-50/50">
          <CardHeader>
            <CardTitle>Procurement Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/inspection/new" className="block">
              <Button className="w-full justify-start h-12 bg-white text-slate-900 hover:bg-green-100 border border-green-200 shadow-sm group">
                <PlusCircle className="w-5 h-5 mr-3 text-green-600 group-hover:scale-110 transition-transform" />
                Start New Inspection
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  )

  const renderInspectorDashboard = () => (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
      <Card className="lg:col-span-5 border-slate-200">
        <CardHeader>
          <CardTitle className="text-yellow-700 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> Pending Manual Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {RECENT_INSPECTIONS.filter(b => b.status === 'Pending Verification').map((batch) => (
              <div key={batch.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-yellow-50 transition-colors bg-yellow-50/30 border-yellow-200">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{batch.id}</span>
                    <Badge variant="warning" className="text-[10px]">Review Required</Badge>
                  </div>
                  <span className="text-xs text-slate-500">Confidence: {batch.confidence}% • {batch.supplier}</span>
                </div>
                <Link href={`/inspection/result/${batch.id}`}>
                  <Button className="bg-yellow-600 hover:bg-yellow-700 text-white" size="sm">Review Evidence</Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 border-slate-200">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/history" className="block">
            <Button className="w-full justify-start h-12 bg-white text-slate-900 border shadow-sm">
              <ClipboardList className="w-5 h-5 mr-3 text-slate-600" />
              Inspection History
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )

  const renderFarmerDashboard = () => (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
      <Card className="lg:col-span-5 border-slate-200">
        <CardHeader>
          <CardTitle>My Recent Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {RECENT_INSPECTIONS.filter(b => b.supplier !== 'Unknown Supplier').map((batch) => (
              <div key={batch.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{batch.id}</span>
                    {batch.status === 'Pending Verification' ? (
                      <Badge variant="warning" className="text-[10px]">Processing</Badge>
                    ) : (
                      <Badge variant={
                        batch.grade === 'A' ? 'success' : 
                        batch.grade === 'B' ? 'default' : 'destructive'
                      } className="text-[10px]">
                        Grade {batch.grade}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">{new Date(batch.date).toLocaleDateString()}</span>
                </div>
                <Link href={`/inspection/result/${batch.id}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="w-4 h-4" /> View Quality Report
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {role === 'PROCUREMENT_OFFICER' && "Procurement Dashboard"}
            {role === 'QUALITY_INSPECTOR' && "Inspector Dashboard"}
            {role === 'FARMER' && "Farmer Dashboard"}
          </h1>
          <p className="text-slate-500 mt-1">
            {role === 'PROCUREMENT_OFFICER' && "Overview of procurement quality assessments"}
            {role === 'QUALITY_INSPECTOR' && "Review pending AI classifications"}
            {role === 'FARMER' && "View your batch quality reports"}
          </p>
        </div>
        {role === 'PROCUREMENT_OFFICER' && (
          <Link href="/inspection/new">
            <Button className="bg-green-600 hover:bg-green-700 shadow-sm gap-2">
              <PlusCircle className="w-4 h-4" />
              New Batch Inspection
            </Button>
          </Link>
        )}
      </div>

      {role === 'PROCUREMENT_OFFICER' && renderProcurementDashboard()}
      {role === 'QUALITY_INSPECTOR' && renderInspectorDashboard()}
      {role === 'FARMER' && renderFarmerDashboard()}
      
    </div>
  )
}
