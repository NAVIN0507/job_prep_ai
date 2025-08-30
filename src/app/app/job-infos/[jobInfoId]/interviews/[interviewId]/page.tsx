import { BackLink } from "@/components/BackLink"
import { Skeleton } from "@/components/Skeleton"
import { SuspendedItem } from "@/components/SuspandedItem"
import { db } from "@/drizzle/db"
import { InterviewTable } from "@/drizzle/schema"
import { getInterviewIdTag, getInterviewJobInfoTag } from "@/features/interviews/dbCache"
import { getJobInfoIdTag } from "@/features/jobinfos/dbCache"
import { formateDateTime } from "@/lib/formatters"
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser"
import { and, desc, eq, isNotNull } from "drizzle-orm"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { notFound } from "next/navigation"

export default async function InterviewPage({params}:{params:Promise<{jobInfoId:string
  , interviewId:string
}>}){
const {jobInfoId , interviewId}  = await params

const interview  = getCurrentUser().then(async({userId , redirectToSignIn})=>{
  if(userId==null) return redirectToSignIn()
    const interview = await getInterviews(interviewId , userId)
  if(interview==null){
    return notFound()
  }
  return interview
})

return (
  <div className="container my-4 space-y-4">
    <BackLink href={`/app/job-infos/${jobInfoId}/interviews`}>
    All Interviews
    </BackLink>
    <div className="space-y-6">
      <div className="flex gap-2 justify-between">
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl md:text-4xl">
            Interview:{" "}
          </h1>
          <SuspendedItem
          item={interview}
          fallback={<Skeleton className="w-48"/>}
          result={i=>formateDateTime(i.createdAt)}
          />
        </div>
      </div>
    </div>
  </div>
)
}


async function getInterviews(id:string,userId:string){
  "use cache"
  cacheTag(getInterviewIdTag(id))
const interview = await db.query.InterviewTable.findFirst({
  where:eq(InterviewTable.id , id),
  with:{
    jobInfo:{
      columns:{
        id:true,
        userId:true
      }
    }
  }
})
if(interview == null) return null
cacheTag(getJobInfoIdTag(interview.jobInfo.id))

if(interview.jobInfo.userId!==userId) return null

return interview
}