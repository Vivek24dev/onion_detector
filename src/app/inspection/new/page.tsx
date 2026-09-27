"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AIAnalysisService, ValidationStatus } from "@/lib/ai-service"
import { UploadCloud, Loader2, AlertTriangle, CheckCircle2, ArrowRight, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function NewInspectionPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [supplier, setSupplier] = useState("")
  
  // Demo scenarios
  const [demoScenario, setDemoScenario] = useState<string>("good-batch")
  
  const [status, setStatus] = useState<"IDLE" | "UPLOADING" | "VALIDATING" | "ERROR" | "SUCCESS">("IDLE")
  const [errorMessage, setErrorMessage] = useState("")
  const [errorType, setErrorType] = useState<ValidationStatus | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setStatus("IDLE")
      setErrorMessage("")
      setErrorType(null)
    }
  }

  const handleReset = () => {
    setFile(null)
    setStatus("IDLE")
    setErrorMessage("")
    setErrorType(null)
  }

  const handleSimulateSubmit = async () => {
    if (!supplier) {
      setErrorMessage("Please enter supplier details.")
      setStatus("ERROR")
      return
    }

    setStatus("VALIDATING")
    setErrorMessage("")
    setErrorType(null)

    try {
      const validation = await AIAnalysisService.validateImage(file, { testScenario: demoScenario })
      
      if (validation.status !== 'VALID') {
        setStatus("ERROR")
        setErrorMessage(validation.message)
        setErrorType(validation.status)
        return
      }

      setStatus("SUCCESS")
      
      // Proceed to result page after a short delay
      setTimeout(() => {
        // Pass demo scenario via query params to simulate the result
        router.push(`/inspection/result/new?scenario=${demoScenario}&supplier=${encodeURIComponent(supplier)}`)
      }, 1000)

    } catch {
      setStatus("ERROR")
      setErrorMessage("An unexpected error occurred during validation.")
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">New Batch Inspection</h1>
        <p className="text-slate-500">Upload batch image for AI-based quality assessment</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Batch Details</CardTitle>
          <CardDescription>Enter supplier and batch information before capturing the image.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Supplier / Farmer Name</label>
            <input 
              type="text" 
              className="w-full border rounded-md h-10 px-3 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" 
              placeholder="e.g. Ramesh Farms"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            />
          </div>

          <div className="space-y-2 pt-4 border-t mt-4">
            <label className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <span>Demo Controls (For Prototype)</span>
            </label>
            <p className="text-xs text-slate-500 mb-2">Select a scenario to simulate AI classification without needing a real model.</p>
            <select 
              className="w-full border border-purple-200 bg-purple-50 rounded-md h-10 px-3 outline-none focus:border-purple-500"
              value={demoScenario}
              onChange={(e) => setDemoScenario(e.target.value)}
            >
              <optgroup label="Success Scenarios">
                <option value="good-batch">Good Batch (Grade A)</option>
                <option value="mixed-batch">Mixed Batch (Grade B)</option>
                <option value="poor-batch">Poor Batch (Reject)</option>
                <option value="low-confidence">Low Confidence (Requires Review)</option>
              </optgroup>
              <optgroup label="Validation Failures">
                <option value="non-onion">Non-Onion Image</option>
                <option value="blurry">Blurry Image</option>
                <option value="low-count">Low Onion Count</option>
              </optgroup>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Image Capture / Upload</CardTitle>
          <CardDescription>Upload a clear image of the onion batch. Ensure good lighting.</CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className={cn(
              "border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center transition-colors",
              file && status !== "ERROR" ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200 hover:bg-slate-100",
              status === "ERROR" && "bg-red-50 border-red-200"
            )}
          >
            {status === "VALIDATING" ? (
              <div className="flex flex-col items-center text-slate-500">
                <Loader2 className="w-10 h-10 mb-4 animate-spin text-green-600" />
                <p className="font-medium">Validating image quality...</p>
                <p className="text-xs mt-1">Checking lighting and onion coverage</p>
              </div>
            ) : status === "SUCCESS" ? (
              <div className="flex flex-col items-center text-green-600">
                <CheckCircle2 className="w-10 h-10 mb-4" />
                <p className="font-medium">Image Validated!</p>
                <p className="text-xs mt-1">Proceeding to AI analysis...</p>
              </div>
            ) : status === "ERROR" && errorType === "NOT_ONION" ? (
              <div className="flex flex-col items-center text-red-600">
                <XCircle className="w-10 h-10 mb-4" />
                <p className="font-bold">Image Rejected</p>
              </div>
            ) : status === "ERROR" && (errorType === "POOR_IMAGE" || errorType === "LOW_COUNT") ? (
              <div className="flex flex-col items-center text-yellow-600">
                <AlertTriangle className="w-10 h-10 mb-4" />
                <p className="font-bold">⚠ Image quality insufficient</p>
              </div>
            ) : (
              <>
                <UploadCloud className="w-10 h-10 text-slate-400 mb-4" />
                <p className="text-sm font-medium text-slate-700 mb-1">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  SVG, PNG, JPG or GIF (max. 5MB)
                </p>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  id="image-upload"
                  onChange={handleFileChange}
                />
                <Button variant="outline" onClick={() => document.getElementById('image-upload')?.click()}>
                  Browse Files
                </Button>
              </>
            )}
          </div>

          {status === "ERROR" && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md flex flex-col gap-3 text-red-800">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold">{errorType === 'NOT_ONION' ? 'No onions detected' : 'Validation Failed'}</p>
                  <p className="text-sm">{errorMessage}</p>
                </div>
              </div>
              <div className="pl-8 pt-2">
                <Button variant="outline" size="sm" onClick={handleReset} className="bg-white hover:bg-red-50 text-red-700 border-red-200">
                  Upload Another Image
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t p-6">
          <Button variant="outline" onClick={() => router.back()} disabled={status === "VALIDATING" || status === "SUCCESS"}>
            Cancel
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 gap-2"
            onClick={handleSimulateSubmit}
            disabled={status === "VALIDATING" || status === "SUCCESS" || status === "ERROR"}
          >
            {status === "VALIDATING" ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
            ) : (
              <>Analyze Batch <ArrowRight className="w-4 h-4" /></>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
