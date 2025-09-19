"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { UploadIcon } from "lucide-react"
import { useRef, useState } from "react"
import { experimental_useObject as useObject } from "@ai-sdk/react"
import { toast } from "sonner"
import { LoadingSwap } from "@/components/ui/loading-swap"
export const ResumePageClient =  ({jobInfoId}:{jobInfoId:string})=>{
  const [isDragOver, setisDragOver] = useState(false);
  const fileRef = useRef<File | null>(null)
  const {object:aiAnalysis , isLoading}  = useObject({})
  function handleFileUplaod(file:File|null){
    fileRef.current = file
    if(file==null) return

    if(file.size >  10 * 1024 * 1024){
      toast.error("File size exceeds 10MB limit")
      return
    }
    const allowedTypes  = [
      "application/pdf",
      "application/msword",
      "text/plain"
    ]
    if(!allowedTypes.includes(file.type)){
      toast.error("Plese upload a PDF , word document , or text file")
      return
    }

  }
  return(
    <div className="space-y-8 w-full">
      <Card>
        <CardHeader>
          <CardTitle>Upload your resume</CardTitle>
          <CardDescription>Get personalized feedback on your resume based on the job</CardDescription>
        </CardHeader>
        <CardContent>
                  <LoadingSwap isLoading={isLoading}>
          <div className={cn("mt-2 border-2 border-dashed rounded-lg p-6 transition-colors relative" , 
            isDragOver? "border-primary bg-primary/10":"border-muted hover:border-primary"
          )}
          onDragOver={e=>{
            e.preventDefault()
            setisDragOver(true)
          }}
          onDragLeave={(e)=>{
            e.preventDefault()
            setisDragOver(false)
          }}
          onDrop={(e)=>{
            e.preventDefault()
            setisDragOver(false)
            handleFileUplaod(e.dataTransfer.files[0] || null)
          }}
          >
            <input type="file"
            accept=".pdf,..doc,.docx"
            className="opacity-0 absolute inset-0 cursor-pointer"
            onChange={(e)=>{
              handleFileUplaod(e.target.files?.[0] ?? null)
            }}
            />
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                 <UploadIcon className="size-12 text-muted-foreground"/>
                 <div className="space-y-2">
                 <p className="text-lg">
                  Drag and drop your resume here or click to Upload
                 </p>
                 <p className="text-xs text-muted-foreground">
                  Supported formates: PDF, Word docs and text fiels
                 </p>
                 </div>
            </div>
          </div>
          </LoadingSwap>
        </CardContent>
      </Card>
    </div>
  )
}