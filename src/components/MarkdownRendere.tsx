import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import Markdown from "react-markdown"
export function MarkdownRenderer({className, ...props}:{className?:string} & ComponentProps<typeof Markdown>){
  return(
  <div className={cn(className  , "max-w-none prose prose-neutral dark:porse-invert font-sans")}>
    <Markdown {...props}/>
  </div>
  )
}