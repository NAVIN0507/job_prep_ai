import { JobInfoBackLink } from "@/features/jobinfos/components/JobInfoBackLink";
import { Suspense } from "react";
import { Loader2Icon } from "lucide-react";
import { canRunResumeAnalysis } from "@/features/resumeAnalyses/permission";
import { redirect } from "next/navigation";
import { ResumePageClient } from "./_client";
export default async function ResumePage({params}:{params:Promise<{jobInfoId:string}>}) {
  const {jobInfoId}  = await params
  return(
  <div className="container py-4 space-y-4 h-screen-header flex flex-col items-start">
    <JobInfoBackLink jobInfoId={jobInfoId}/>
    <Suspense fallback={
      <div className="my-auto flex items-center justify-center">
        <Loader2Icon className="animate-spin size-24"/>
      </div>
    }>
      <SuspendedComponent jobInfoId={jobInfoId}/>
    </Suspense>
  </div>
  )
}

async function SuspendedComponent({jobInfoId}:{jobInfoId:string}){
  if(!(await canRunResumeAnalysis())) return redirect("/app/upgrade") 
  return <ResumePageClient jobInfoId={jobInfoId}/>
}