"use client"

import { useEffect, useState, use } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AIAnalysisService } from "@/lib/ai-service"
import { BatchResult, OnionGrade } from "@/lib/types"
import { useRole } from "@/lib/role-context"
import { Loader2, Download, Share2, CheckCircle2, AlertTriangle, ShieldCheck, Edit3 } from "lucide-react"

export default function ResultPage(props: { params: Promise<{ id: string }> }) {
  const { role } = useRole()
  const params = use(props.params);
  const searchParams = useSearchParams()
  const scenario = searchParams.get('scenario') || 'good-batch'
  const supplierQuery = searchParams.get('supplier')
  
  const [result, setResult] = useState<BatchResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [editingGrade, setEditingGrade] = useState(false)
  const [newGrade, setNewGrade] = useState<OnionGrade>('A')

  useEffect(() => {
    async function fetchResult() {
      const data = await AIAnalysisService.analyzeBatch(null, { testScenario: scenario })
      if (supplierQuery) {
        data.supplier = supplierQuery
      }
      if (params.id === 'new') {
        data.id = `ON-${Math.floor(10000 + Math.random() * 90000)}`
      }
      setResult(data)
      setNewGrade(data.grade)
      setLoading(false)
    }
    fetchResult()
  }, [scenario, supplierQuery, params.id])

  const handleVerify = () => {
    setVerifying(true)
    setTimeout(() => {
      if (result) {
        setResult({ ...result, status: 'Completed', inspectorApproved: true, grade: newGrade })
      }
      setVerifying(false)
      setEditingGrade(false)
    }, 1000)
  }

  if (loading || !result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
        <h2 className="text-xl font-semibold">Running Demo Analysis...</h2>
        <p className="text-slate-500">Detecting onions, grading quality, and checking for defects.</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">Quality Report</h1>
            <Badge variant="outline" className="text-sm bg-slate-100">{result.id}</Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">Demo Analysis</Badge>
          </div>
          <p className="text-slate-500">{new Date(result.date).toLocaleString()} • {result.supplier}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" /> Share
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </Button>
        </div>
      </div>

      {result.status === 'Pending Verification' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 flex flex-col sm:flex-row items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-yellow-600 shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-800 text-lg">Manual Verification Required</h3>
            <p className="text-sm text-yellow-700 mt-1">
              AI confidence score ({result.confidence}%) is below the automated threshold. 
            </p>
            
            {role === 'QUALITY_INSPECTOR' && (
              <div className="mt-4 bg-white p-4 rounded border border-yellow-200">
                <p className="text-sm font-semibold mb-3">Inspector Actions:</p>
                {editingGrade ? (
                  <div className="flex items-center gap-3">
                    <select 
                      className="border rounded px-3 py-1.5 outline-none"
                      value={newGrade}
                      onChange={(e) => setNewGrade(e.target.value as OnionGrade)}
                    >
                      <option value="A">Grade A</option>
                      <option value="B">Grade B</option>
                      <option value="Reject">Reject</option>
                    </select>
                    <Button onClick={handleVerify} disabled={verifying} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                      {verifying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                      Confirm Final Grade
                    </Button>
                    <Button variant="ghost" onClick={() => setEditingGrade(false)}>Cancel</Button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button onClick={handleVerify} disabled={verifying} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                      {verifying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                      Approve Grade {result.grade}
                    </Button>
                    <Button variant="outline" onClick={() => setEditingGrade(true)} className="gap-2">
                      <Edit3 className="w-4 h-4" /> Modify Grade
                    </Button>
                  </div>
                )}
              </div>
            )}
            {role !== 'QUALITY_INSPECTOR' && (
              <p className="text-sm font-medium mt-2 text-yellow-800 bg-yellow-100 p-2 rounded inline-block">
                Waiting for Quality Inspector review.
              </p>
            )}
          </div>
        </div>
      )}

      {result.inspectorApproved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 text-green-800">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <p className="text-sm font-medium">Grade manually verified and approved by Quality Inspector.</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b pb-4">
            <CardTitle className="text-lg">Final Decision</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col items-center">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center border-8 mb-4 ${
              result.grade === 'A' ? 'border-green-100 bg-green-50 text-green-600' :
              result.grade === 'B' ? 'border-blue-100 bg-blue-50 text-blue-600' :
              'border-red-100 bg-red-50 text-red-600'
            }`}>
              <div className="text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 block mb-1">Grade</span>
                <span className="text-5xl font-black">{result.grade}</span>
              </div>
            </div>
            
            <div className="w-full space-y-4 mt-2">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-slate-500">Quality Score</span>
                <span className="font-semibold">{result.qualityScore}%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-slate-500">AI Confidence</span>
                <span className="font-semibold">{result.confidence}%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-slate-500">Total Onions</span>
                <span className="font-semibold">{result.totalOnions}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b pb-4">
              <CardTitle className="text-lg">Why Grade {result.grade}?</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-slate-700 leading-relaxed mb-4">{result.reason}</p>
              {result.grade !== 'A' && (
                <div className="bg-slate-50 p-4 rounded-md border text-sm">
                  <p className="font-semibold mb-2 text-slate-800">Primary Factors:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    {result.defects.undersized > 0 && <li>Undersized: {result.defects.undersized}%</li>}
                    {result.defects.damaged > 0 && <li>Damaged: {result.defects.damaged}%</li>}
                    {result.defects.rotten > 0 && <li>Rotten: {result.defects.rotten}%</li>}
                    {result.defects.sprouted > 0 && <li>Sprouted: {result.defects.sprouted}%</li>}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b pb-3">
                <CardTitle className="text-[15px]">Defect Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <DistributionRow label="Healthy" value={result.defects.healthy} color="bg-green-500" />
                <DistributionRow label="Undersized" value={result.defects.undersized} color="bg-blue-400" />
                <DistributionRow label="Damaged" value={result.defects.damaged} color="bg-yellow-500" />
                <DistributionRow label="Sprouted" value={result.defects.sprouted} color="bg-orange-500" />
                <DistributionRow label="Rotten" value={result.defects.rotten} color="bg-red-600" />
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b pb-3">
                <CardTitle className="text-[15px]">Size Estimation</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <DistributionRow label="Small" value={result.sizes.small} color="bg-slate-400" />
                <DistributionRow label="Standard" value={result.sizes.standard} color="bg-slate-600" />
                <DistributionRow label="Large" value={result.sizes.large} color="bg-slate-800" />
                
                <div className="mt-6 pt-4 border-t">
                  <p className="text-xs text-slate-500 italic">
                    * Sizes are estimated relative to camera distance. A calibration marker is recommended for precise cm measurements.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b">
          <CardTitle className="text-lg">Visual Evidence</CardTitle>
          <CardDescription>Detected onions and identified defects.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-slate-900 w-full h-[400px] flex items-center justify-center relative overflow-hidden group">
            {/* Mocked Image with Bounding Boxes */}
            <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[url('https://images.unsplash.com/photo-1618512496248-a07ce83aa8cb?auto=format&fit=crop&q=80')] bg-cover bg-center" />
            
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-white text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20 mb-4">
                Prototype Demo Visualization
              </span>
              
              <div className="relative w-80 h-60 border border-white/10 rounded">
                {/* Mock bounding boxes */}
                <div className="absolute top-10 left-10 w-16 h-16 border-2 border-green-500 bg-green-500/20" />
                <div className="absolute top-24 left-32 w-14 h-14 border-2 border-green-500 bg-green-500/20" />
                <div className="absolute top-8 left-40 w-12 h-12 border-2 border-red-500 bg-red-500/20">
                  <span className="absolute -top-5 -left-1 text-[8px] bg-red-500 text-white px-1">Rotten</span>
                </div>
                <div className="absolute top-32 left-16 w-10 h-10 border-2 border-blue-400 bg-blue-400/20">
                   <span className="absolute -bottom-5 -left-1 text-[8px] bg-blue-400 text-white px-1">Undersized</span>
                </div>
                <div className="absolute top-20 left-60 w-16 h-16 border-2 border-yellow-500 bg-yellow-500/20">
                  <span className="absolute -top-5 -left-1 text-[8px] bg-yellow-500 text-white px-1">Damaged</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DistributionRow({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="w-24 text-slate-600 font-medium">{label}</div>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
      </div>
      <div className="w-10 text-right font-semibold text-slate-700">{value}%</div>
    </div>
  )
}
