import { pgTable , uuid  , varchar} from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { JobInfoTable } from "./jobinfo";
import { relations } from "drizzle-orm";
export const InterviewTable = pgTable("interviews" , {
  id,
  jobInfoId:uuid().references(()=>JobInfoTable.id , {onDelete:"cascade"}).notNull(),
  duration:varchar().notNull(),
  humeChatId:varchar().notNull(),
  feedback:varchar(),
  createdAt,
  updatedAt
})

export const interviewRelations = relations(InterviewTable , ({one})=>({
  jobInfo:one(JobInfoTable , {
    fields:[InterviewTable.jobInfoId],
    references:[JobInfoTable.id]
  })
}))