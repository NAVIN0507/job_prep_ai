import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { redirect } from "next/navigation";

export default async function AppLayout({children}:{children:React.ReactNode}){
  const {userId , user} = await getCurrentUser({allData:true});
  if(userId==null) return redirect("/");
  if(user==null) return redirect("/onboarding")
    return(
  <>
  {children}
  </>)
}