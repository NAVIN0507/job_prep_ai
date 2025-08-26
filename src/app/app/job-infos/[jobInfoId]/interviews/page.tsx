import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/drizzle/db"
import { InterviewTable } from "@/drizzle/schema"
import { getInterviewJobInfoTag } from "@/features/interviews/dbCache"
import { JobInfoBackLink } from "@/features/jobinfos/components/JobInfoBackLink"
import { getJobInfoIdTag } from "@/features/jobinfos/dbCache"
import { formateDateTime } from "@/lib/formatters"
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser"
import { and, desc, eq, isNotNull } from "drizzle-orm"
import { PlusIcon, Loader2Icon, ArrowRight } from "lucide-react"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"

export default async function IntervirePage({params}:{params:Promise<{jobInfoId:string}>}){
  const {jobInfoId} = await params
  return(
    <div className="container py-4 gap-4 h-screen-header flex flex-col items-start">
      <JobInfoBackLink jobInfoId={jobInfoId}/>
      <Suspense fallback={<Loader2Icon className="size-24 animate-spin m-auto"/>}>
      <SuspendedPage jobInfoId={jobInfoId}/>
      </Suspense>
    </div>
  )
}
async function SuspendedPage({jobInfoId}:{jobInfoId:string}){
  const  {userId , redirectToSignIn} = await getCurrentUser();
  if(userId==null) return redirectToSignIn();
  const interviews =  await getInterviews(jobInfoId , userId) 
  if(interviews.length===0){
    return redirect(`/app/job-infos/${jobInfoId}/interviews/new`)
  }
  return <div className="space-y-6 w-full">
    <div className="flex gap-2 justify-between mb-6">
      <h1 className="text-3xl md:text-4xl lg:text-4xl">
        Interviews
      </h1>
      <Button asChild>
        <Link href={`/app/job-infos/${jobInfoId}/interviews/new`}>
        <PlusIcon/>
        New Interview
        </Link>
      </Button>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Link href={`/app/job-infos/${jobInfoId}/interviews/new`}>
      <Card className="h-full flex items-center justify-center border-dashed border-3 bg-transparent hover:border-primary/50 transition-colors shadow-none">
      <div className="text-lg flex items-center gap-2">
        <PlusIcon className="size-6"/> New Interview
        </div></Card>
      </Link>
      {interviews.map((interview)=>(
        <Link className="hover:scale-[1.02] transition-transform" href={`/app/job-infos/${jobInfoId}/interviews/${interview.id}`} key={interview.id}>
          <Card className="h-full">
            <div className="flex items-center justify-between h-full">
              <div className="space-y-4 h-full ">
                <CardHeader className="gap-1 flex-grow">
                  <CardTitle className="line-clamp-1">
                  {formateDateTime(interview.createdAt)}
                  </CardTitle>
                  <CardDescription>{interview.duration}</CardDescription>
                  </CardHeader>
              </div>
              <CardContent>
                <ArrowRight className="size-6"/>
              </CardContent>
            </div>
          </Card>
        </Link>
      ))}
    
    </div>
  </div>
}
async function getInterviews(jobInfoId:string,userId:string){
  "use cache"
  cacheTag(getInterviewJobInfoTag(jobInfoId))
  cacheTag(getJobInfoIdTag(jobInfoId))
  const data  = await db.query.InterviewTable.findMany({
    where:and(
      eq(InterviewTable.jobInfoId , jobInfoId),
      isNotNull(InterviewTable.humeChatId)
    ),
    with:{jobInfo:{columns:{userId:true}}},
    orderBy:desc(InterviewTable.updatedAt),
  })
  return data.filter(interview => interview.jobInfo.userId === userId)
}