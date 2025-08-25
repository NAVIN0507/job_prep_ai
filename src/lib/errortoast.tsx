import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
export const PLAN_LIMIT_MESSAGE = "PLAN_LIMIT"
export const RATE_LIMIT_MESSAGE ="RATE_LIMIT"

export function errorToast(message:string){
  if(message === PLAN_LIMIT_MESSAGE){
   const toastId =  toast.error(
      "You have reached your limit.",{
        action:(
          <Button size={"sm"} asChild onClick={()=>{toast.dismiss(toastId)}}>
            <Link href={"/app/upgrade"}>Upgrade</Link>
          </Button>
        )
      }
    )
  }
  if(message === RATE_LIMIT_MESSAGE){
   const toastId =  toast.error(
      "Slow Down Buddy !!",{
       description:"You are making too many requeste. Please try again later."
      }
    )
  }
  toast.error(message)
}