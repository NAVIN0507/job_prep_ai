"use server"

import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser"
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getJobInfoIdTag } from "../jobinfos/dbCache";
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import { InterviewTable, JobInfoTable } from "@/drizzle/schema";
import { insertInterview, updateIntervieDB } from "./db";
import { getInterviewIdTag } from "./dbCache";
import { error } from "console";

export async function createInterview({jobInfoId}:{jobInfoId:string}):Promise<{
  error:true,
  message:string
}| {error:false; id:string}>{
  const {userId}  = await getCurrentUser();
  if(userId==null){
    return {
      error:true,
      message:"You don't have permission to create interview"
    }
  }

  // Permission
  // Rate Limit
  // Job Info
  const jobInfo = await getJobInfo(jobInfoId , userId);
if(jobInfo==null){
    return {
      error:true,
      message:"You don't have permission to create interview"
    }
  }
  const interview  = await insertInterview({jobInfoId , duration:"00:00:00", humeChatId:""})
  return {error:false , id:interview.id}
}
export async function updateInterview(id:string,{humeChatId , duration}:{humeChatId?:string ;
  duration?:string}){
     const {userId}  = await getCurrentUser();
  if(userId==null){
    return {
      error:true,
      message:"You don't have permission to create interview"
    }
  } 
  const interview = await getInterview(id , userId);
  if(interview==null){
    return {
      error:true,
      message:"You don't have permission to create interview"
    }
  } 

  await updateIntervieDB(id , {duration,humeChatId})
  return {error:false}
  }

async function getJobInfo(jobInfoId:string, userId:string){
  "use cache"
  cacheTag(getJobInfoIdTag(jobInfoId))
  return db.query.JobInfoTable.findFirst({
    where:and(eq(JobInfoTable.id , jobInfoId) , eq(JobInfoTable.userId , userId))
  })
}
async function getInterview(id:string , userId:string){
  "use cache"
  cacheTag(getInterviewIdTag(id))
  const interview =  await db.query.InterviewTable.findFirst({
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
  if(interview == null) return null;
  cacheTag(getJobInfoIdTag(interview.jobInfo.id))
  if(interview.jobInfo.userId==null){
    return null
  }
  return interview
}