import { BackLink } from "@/components/BackLink";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { JobInfoTable } from "@/drizzle/schema";

export function NewQuetionsClientPage({
  jobInfo,
}: {
  jobInfo: Pick<typeof JobInfoTable.$inferSelect, "id" | "name" | "title">;
}) {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="container flex gap-4 py-4 items-center justify-between">
        <div className="flex-grow basis-0">
          <BackLink href={`/app/job-infos/${jobInfo.id}`} className="text-sm">
            {jobInfo.name}
          </BackLink>
        </div>
        <Controls />
        <div className="flex-grow hidden md:block" />
      </div>
      <div className="flex-1 min-h-0">
        <QuestionContainer />
      </div>
    </div>
  );
}
function QuestionContainer() {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full border-t">
      <ResizablePanel
        id="question-and-feedback"
        defaultSize={50}
        minSize={30}
        className="p-4"
      >
        Left
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel id="answer" defaultSize={50} minSize={30} className="">
        <ScrollArea className="h-full min-w-48 *:h-full">
          <Textarea className="w-full h-full resize-none border-none rounded-none focus-visible:ring focus-visible:ring-inset !text-base p-6" placeholder="Type your answer here..."/>
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
function Controls() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary">Save</Button>
      <Button>Generate Question</Button>
    </div>
  );
}
