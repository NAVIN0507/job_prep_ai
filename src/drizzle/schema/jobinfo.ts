import { pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { QuestionsTable } from "./questions";
import { InterviewTable } from "./interview";
import { UsersTable } from "./user";
import { relations } from "drizzle-orm";
export const experienceLevel = ["junior" , "mid-level" , "senior"] as const;
export type ExperienceLevel = (typeof experienceLevel)[number];
export const experienceLevelEnum = pgEnum("job_info_experience_level" , experienceLevel);
export const JobInfoTable =  pgTable("job_info" , {
  id,
  title:varchar(),
  name:varchar().notNull(),
  experienceLevel:experienceLevelEnum().notNull(),
  description:varchar().notNull(),
  userId:varchar().references(()=>UsersTable.id , {onDelete:"cascade"}).notNull(),
  createdAt,
  updatedAt
})

export const jobInfoRelations  =relations(JobInfoTable , ({one , many})=>({
  user:one(UsersTable , {
    fields:[JobInfoTable.userId],
    references:[UsersTable.id]    
  }),
  questions:many(QuestionsTable),
  interviews:many(InterviewTable)
}))