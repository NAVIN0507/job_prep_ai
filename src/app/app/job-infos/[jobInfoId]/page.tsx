import { BackLink } from "@/components/BackLink";
import { Skeleton } from "@/components/Skeleton";
import { SuspendedItem } from "@/components/SuspandedItem";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription,  CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { JobInfoTable } from "@/drizzle/schema";
import { getJobInfoIdTag } from "@/features/jobinfos/dbCache";
import { formateExperienceLevel } from "@/features/jobinfos/lib/formatters";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { and, eq } from "drizzle-orm";
import { ArrowRight, PlusIcon } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";
import { notFound } from "next/navigation";
const options =  [
  {
    label:"Answer Technical Questions",
    description:"Challenge yourself with practice questions tailored to your job description.",
    href:"questions"
  },
  {
    label:"Practive Interviewing",
    description:"Simulate a real interview eith AI-powered mock interviwes.",
    href:"interviews"
  },

  {
    label:"Refine Your Resume",
    description:"Get expert feedback on your resume and improve your chance of landing an interview",
    href:"resume"
  },

  {
    label:"Update Job Description ",
    description:"This should only be used for minor updates.",
    href:"edit"
  },
]
export default async function JobInfoPage({params}:{params:Promise<{jobInfoId:string}>}){
  const {jobInfoId}  =await params;
  const jobInfo = getCurrentUser().then(
    async({userId , redirectToSignIn})=>{
      if(userId==null) return redirectToSignIn()
        const jobInfo = await getJobInfo(jobInfoId , userId);
      if(jobInfo==null)  return notFound()
        return  jobInfo
    }
  )
  return(
    <div className="container my-4 space-y-4">
      <BackLink href="/app">Dashboard</BackLink>
      <div className="space-y-6">
      <header className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl">
            <SuspendedItem item={jobInfo} fallback={<Skeleton className="w-48"/>} result={j=>j.name}/>
          </h1>
          <div className="flex gap-2">
              <SuspendedItem item={jobInfo} fallback={<Skeleton className="w-12"/>} result={j=>(
            <Badge variant={"secondary"}>
              {formateExperienceLevel(j?.experienceLevel)}
            </Badge>
              )}/>
                <SuspendedItem item={jobInfo} fallback={<Skeleton className="w-fit
                "/>} result={j=>(
            j?.title && <Badge variant={"secondary"}>{j.title}</Badge>
            )}/>
          </div>
        </div>
          <SuspendedItem item={jobInfo} fallback={<Skeleton className="w-96"/>} result={j=>(
        <p className="text-muted-foreground line-clamp-3">{j.description}</p>
      )}/>
      </header>
      </div>
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {options.map((option)=>(
        <Link className="hover:scale-[1.02] transition-transform" href={`/app/job-info/${jobInfoId}/${option.href}`} key={option.label}>
          <Card className="h-full flex items-start justify-between flex-row">
                <CardHeader className="flex-grow">
                  <CardTitle>
                  {option.label}
                  </CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
              <CardContent>
                <ArrowRight className="size-6"/>
              </CardContent>
         
          </Card>
        </Link>
      ))}
    </div>
    </div>
  )
}

async function getJobInfo(id:string , userId:string){
  "use cache"
  cacheTag(getJobInfoIdTag(id))
  return db.query.JobInfoTable.findFirst({
    where:and(eq(JobInfoTable.id , id) , eq(JobInfoTable.userId , userId))
  })
}