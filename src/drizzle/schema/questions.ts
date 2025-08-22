import { pgEnum, pgTable, varchar  , uuid} from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";

import { relations } from "drizzle-orm";
import { JobInfoTable } from "./jobinfo";
export const questionsDifficulties = ["easy" , "medium" , "hard"] as const;
export type QusetionDeficulties = (typeof questionsDifficulties)[number];
export const qusetionDeficultiesEnum = pgEnum("questions_question_difficulty" , questionsDifficulties);
export const QuestionsTable =  pgTable("questions" , {
  id,
   jobInfoId:uuid().references(()=>JobInfoTable.id , {onDelete:"cascade"}).notNull(),
   text:varchar().notNull(),
  difficulty:qusetionDeficultiesEnum().notNull(),
  createdAt,
  updatedAt
})

export const questionsRelations  =relations(QuestionsTable , ({one})=>({
  user:one(JobInfoTable , {
    fields:[QuestionsTable.jobInfoId],
    references:[JobInfoTable.id]    
  })
}))