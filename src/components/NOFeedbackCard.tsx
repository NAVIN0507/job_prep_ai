import { generateInterviewFeedback } from "@/features/interviews/actions"
import { ActionButton } from "./ui/action-button"
import { Card, CardContent } from "./ui/card"
export async function NOFeedBackCard({interviewId}:{interviewId:string}){
return(
  <Card className="flex items-center justify-center">
    <CardContent className="flex flex-col gap-5">
      <h2>No FeedBack for this Interview</h2>
      <ActionButton action={generateInterviewFeedback.bind(null , interviewId)}>Generate Interview Feedback</ActionButton>
    </CardContent>
  </Card>
)
}