"use server"

import z from "zod";
import { jobInfoSchema } from "./schemas";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { insertJobInfo , updateJobInfo as updateJobInfoDB} from "./db";
import { redirect } from "next/navigation";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getJobInfoIdTag } from "./dbCache";
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import { JobInfoTable } from "@/drizzle/schema";

export async function createJobInfo(unsafeData:z.infer<typeof jobInfoSchema>){
  const {userId}  =await getCurrentUser();
  if(userId==null){
    return{
      error:true,
      message:"You dont have permission to do this"
    }
  }
  const {success , data}  = jobInfoSchema.safeParse(unsafeData);
  if(!success){
    return {
      error:true,
      message:"Invalid Job Info"
    }
  }
  const jobInfo = await insertJobInfo({...data , userId});
  redirect(`/app/job-infos/${jobInfo.id}`)
  
}

export async function updateJobInfo(id:string, unsafeData:z.infer<typeof jobInfoSchema>){
const {userId} = await getCurrentUser();
if(userId==null){
  return {
    error:true,
    message:"You don't have permission to do this"
  }
}
const {success , data} = jobInfoSchema.safeParse(unsafeData);
if(!success){
  return {
    error:true,
    message:"Invalid Job Info"
  }
}
const existingJobInfo = await getJobInfo(id , userId);
if(existingJobInfo == null){
  return{
    error:true,
    message:"Job info not found"
  }
}
const jobInfo = await updateJobInfoDB(id , data)
 redirect(`/app/job-infos/${jobInfo.id}`)
}

async function getJobInfo(id:string,userId:string){
"use cache"
cacheTag(getJobInfoIdTag(id));
return db.query.JobInfoTable.findFirst({
  where:and(eq(JobInfoTable.id , id) , eq(JobInfoTable.userId , userId))
})
}