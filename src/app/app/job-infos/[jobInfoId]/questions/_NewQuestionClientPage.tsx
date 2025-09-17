"use client"
import { BackLink } from "@/components/BackLink";
import { MarkdownRenderer } from "@/components/MarkdownRendere";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { JobInfoTable, questionsDifficulties } from "@/drizzle/schema";
import { useState } from "react";
type Status  = "awaiting-answer" | "awaiting-defficulties" | "init"

export function NewQuetionsClientPage({
  jobInfo,
}: {
  jobInfo: Pick<typeof JobInfoTable.$inferSelect, "id" | "name" | "title">;
}) {
  const [status, setstatus] = useState<Status>("init");
  const [ answer, setAnswer ] = useState<string | null>(null);
  const question = null
  const feedback = null
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="container flex gap-4 py-4 items-center justify-between">
        <div className="flex-grow basis-0">
          <BackLink href={`/app/job-infos/${jobInfo.id}`} className="text-sm">
            {jobInfo.name}
          </BackLink>
        </div>
        <Controls  status={status}/>
        <div className="flex-grow hidden md:block" />
      </div>
      <div className="flex-1 min-h-0">
        <QuestionContainer 
        status={status}
        questions={question}
        feedback={feedback}
        answer={answer}
        setAnswer={setAnswer}
        />
      </div>
    </div>
  );
}
function QuestionContainer(
{  questions,
  feedback,
  answer,
  status,
  setAnswer} :{
    questions:string | null,
  feedback : string | null,
  answer: string| null
  status:Status
  setAnswer:(value:string)=>void
  }
) {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full border-t">
      <ResizablePanel
        id="question-and-feedback"
        defaultSize={50}
        minSize={30}
        className="p-4"
      >
        <ResizablePanelGroup direction="vertical" className="flex-grow">
          <ResizablePanel id="question" defaultSize={25} minSize={5}>
            <ScrollArea className="h-full min-w-48 *:h-full">
              {status==="init" ? (
                <p className="text-lg flex items-center justify-center h-full">
                  Get started by selecting a question difficulty above
                </p>
              ):(
                questions && (
                  <MarkdownRenderer className="p-6 !bg-none border-none">
                    {questions}
                  </MarkdownRenderer>
                )
              )}
            </ScrollArea>
          </ResizablePanel>

          {feedback && (
<>
<ResizableHandle withHandle />
           <ResizablePanel id="feedback" defaultSize={75} minSize={5}>
                  <MarkdownRenderer className="p-6">
                    {feedback}
                  </MarkdownRenderer>
           </ResizablePanel>
           </>
          )}
          </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel id="answer" defaultSize={50} minSize={30} className="">
        <ScrollArea className="h-full min-w-48 *:h-full">
          <Textarea 
          disabled={status !== "awaiting-answer"}
          onChange={(e)=>setAnswer(e.target.value) }
          value={answer || ""}
          className="w-full h-full resize-none border-none rounded-none focus-visible:ring focus-visible:ring-inset !text-base p-6" placeholder="Type your answer here..."/>
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
function Controls({status}:{status:Status}) {

  const isLoading = false;
  return (
    <div className="flex  gap-2">
     {status==="awaiting-answer" ? (
      <button className="btn btn-primary">Submit Answer</button>
     ):(
      questionsDifficulties.map((difficulty)=>(
        <Button className="cursor-pointer"  key={difficulty}  disabled={isLoading} onClick={()=>{}} size="sm">{difficulty.charAt(0).toUpperCase()+difficulty.slice(1)}</Button>
      ))
     )}
    </div>
  );
}
