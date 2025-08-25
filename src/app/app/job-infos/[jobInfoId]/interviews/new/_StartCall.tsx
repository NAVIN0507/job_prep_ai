"use client"

import { Button } from "@/components/ui/button";
import { JobInfoTable } from "@/drizzle/schema";
import { useVoice, VoiceReadyState } from "@humeai/voice-react";

export function StartCall({jobInfo,accessToken,user}:{jobInfo:Pick<typeof JobInfoTable.$inferInsert , "id" | "title" | "description" | "experienceLevel">; accessToken:string;user:{name:string;imageUrl:string}}){
  console.log(accessToken)
  const {connect , readyState , disconnect}  = useVoice();
  if(readyState === VoiceReadyState.IDLE){
    return <div className="flex justify-center items-center h-screen-header">
      <Button onClick={async()=>{
        connect({auth:{type:"accessToken" , value:accessToken}})
      }}>Start Interview</Button>
    </div>
  }
  if(readyState === VoiceReadyState.CONNECTING || readyState === VoiceReadyState.CLOSED){
    return null
  }
return null
}