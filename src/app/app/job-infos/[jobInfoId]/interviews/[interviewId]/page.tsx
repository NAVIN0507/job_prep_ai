import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser"
import { notFound } from "next/navigation"

export default async function InterviewPage({params}:{params:Promise<{jobInfoId:string
  , interviewId:string
}>}){
const {jobInfoId , interviewId}  = await params

const interview  = getCurrentUser().then(({userId , redirectToSignIn})=>{
  if(userId==null) return redirectToSignIn()
    const interview = await getInterview(id , userId)
  if(interview==null){
    return notFound()
  }
  return interview
})
}


async function getInterview(interviewId:string, userId:string){
  "use cache"
}