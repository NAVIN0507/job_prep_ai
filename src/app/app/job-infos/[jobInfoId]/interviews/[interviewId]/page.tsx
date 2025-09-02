import { BackLink } from "@/components/BackLink"
import { MarkdownRenderer } from "@/components/MarkdownRendere"
import { NOFeedBackCard } from "@/components/NOFeedbackCard"
import { Skeleton, SkeletonButton } from "@/components/Skeleton"
import { SuspendedItem } from "@/components/SuspandedItem"
import { ActionButton } from "@/components/ui/action-button"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger , DialogTitle} from "@/components/ui/dialog"
import { db } from "@/drizzle/db"
import { InterviewTable } from "@/drizzle/schema"
import { generateInterviewFeedback } from "@/features/interviews/actions"
import { getInterviewIdTag, getInterviewJobInfoTag } from "@/features/interviews/dbCache"
import { getJobInfoIdTag } from "@/features/jobinfos/dbCache"
import { formateDateTime } from "@/lib/formatters"
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser"
import { fetchChatMessages } from "@/services/hume/lib/api"
import { CondensedMessages } from "@/services/hume/lib/components/CondensedMessages"
import { condenseChatMessages } from "@/services/hume/lib/condensedChatMessages"
import { and, desc, eq, isNotNull } from "drizzle-orm"
import { Loader2Icon } from "lucide-react"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { notFound } from "next/navigation"
import { Suspense } from "react"

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
             <SuspendedItem
          item={interview}
          fallback={<Skeleton className="w-48"/>}
          result={i=>formateDateTime(i.createdAt)}
          />
          </h1>
          <p className="text-muted-foreground"> 
            <SuspendedItem
            item={interview}
            fallback={<Skeleton className="w-24"/>}
            result={i=>i.duration}
            />
          </p>
        </div>
        <SuspendedItem
        item={interview}
        fallback={<SkeletonButton className="w-32"/>}
        result={i=>(
          i.feedback == null &&  <ActionButton action={generateInterviewFeedback.bind(null , i.id)}>Generate Feedback</ActionButton> )}
        />
      </div>
      <Suspense fallback={<Loader2Icon className="animate-spin mx-auto"/>}>
      <Messages interview={interview}/>
      </Suspense>
    </div>
    <div className="p-2 flex flex-col gap-4">
      <h1 className="text-3xl">Feedback : </h1>
      <div>
<SuspendedItem

item={interview}
fallback={<Skeleton className="w-48"/>}
result={i=>(
  <div>
    {i.feedback == null ? <NOFeedBackCard interviewId={i.id}/> :  <MarkdownRenderer>
                  {i.feedback}
                </MarkdownRenderer>}
  </div>
)}
/>
      </div>
    </div>
  </div>
)
}
async function Messages({interview}:{interview:Promise<{humeChatId:string | null}>}){
const {user , redirectToSignIn} = await getCurrentUser({allData:true})
if(user==null) return redirectToSignIn()
  const {humeChatId} = await interview
if(humeChatId==null) return notFound();
const condensedMessages = condenseChatMessages(
  await fetchChatMessages(humeChatId)
)

return <CondensedMessages messages={condensedMessages} user={user} className="max-w-5xl mx-auto"/>
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