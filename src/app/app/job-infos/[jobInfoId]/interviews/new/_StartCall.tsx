"use client";

import { Button } from "@/components/ui/button";
import { JobInfoTable } from "@/drizzle/schema";
import { useVoice, VoiceReadyState } from "@humeai/voice-react";
import { Loader2Icon, MicIcon, MicOffIcon, PhoneOffIcon } from "lucide-react";
import { env } from "@/data/env/client";
import { useMemo } from "react";
import { condenseChatMessages } from "@/services/hume/lib/condensedChatMessages";
import { CondensedMessages } from "@/services/hume/lib/components/CondensedMessages";
export function StartCall({
  jobInfo,
  accessToken,
  user,
}: {
  jobInfo: Pick<
    typeof JobInfoTable.$inferInsert,
    "id" | "title" | "description" | "experienceLevel"
  >;
  accessToken: string;
  user: { name: string; imageUrl: string };
}) {
  console.log(accessToken);
  const { connect, readyState,  } = useVoice();
  if(readyState === VoiceReadyState.IDLE){
    return <div className="min- h-[calc(100vh-4rem)] flex items-center justify-center">
      <Button size="lg" onClick={async()=>{
        connect({
          auth: { type: "accessToken", value: accessToken },
          configId:env.NEXT_PUBLIC_HUME_CONFIG_ID,
          sessionSettings:{
            type:"session_settings",
            variables:{
              userName:user.name,
              title:jobInfo.title || "Not Specified",
              description:jobInfo.description,
              experienceLevel:jobInfo.experienceLevel
            }
          }
        })
      }} className="m-auto">Start Interview</Button>
    </div>
  }
  if (
    readyState === VoiceReadyState.CONNECTING ||
    readyState === VoiceReadyState.CLOSED
  ) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2Icon className="size-24 animate-spin" />
      </div>
    );
  }
  return (
    <div className="relative h-[calc(100vh-4rem)]">
      <div className="overflow-y-auto h-[calc(100%-5rem)] p-6">
        <Messages user={user} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center bg-background/80 backdrop-blur-sm ">
        <Controls />
      </div>
    </div>
  );
}

function Messages({ user }: { user: { name: string; imageUrl: string } }) {
  const {messages , fft}  = useVoice();
  const condensedMessages = useMemo(()=>{
    return condenseChatMessages(messages)
  } , [messages])
  return <CondensedMessages  messages={condensedMessages} user={user} maxFft={Math.max(...fft)}/>
}
function Controls() {
  const { disconnect, isMuted, mute, unmute , fft  , callDurationTimestamp} = useVoice();

  return (
    <div className="flex gap-4 rounded w-fit border px-6 py-3 bg-background items-center">
     <Button value={"ghost"} size={"icon"} className="-mx-3" onClick={()=>(isMuted ? unmute() : mute())}>
      {isMuted ? <MicOffIcon className="text-destructive"/> : <MicIcon/>}
      <span className="sr-only">{isMuted ? 'Unmute' :'Mute'}</span>
     </Button>
     <div className="self-stretch">
      <FftVisulaizer fft={fft}/>
     </div>
     <div className="text-sm text-muted-foreground tabular-nums">
      {callDurationTimestamp}
     </div>
     <Button variant={"ghost"} size={"icon"} className="-mx-3" onClick={disconnect}>
      <PhoneOffIcon className="text-destructive"/>
      <span className="sr-only">End Call</span>
     </Button>
    </div>
  );
}

function  FftVisulaizer({fft}:{fft:number[]}){
  return (
    <div className="flex gap-1 items-center h-full ml-4">
      {fft.map((value , index)=>{
        const percent = (value/4)*100
        return(
          <div
          key={index}
          className="min-h-0.5 bg-primary/75 w-0.5 rounded"
          style={{height:`${percent<10 ? 0 : percent}`}}
          />
        )
      })}
    </div>
  )
}
