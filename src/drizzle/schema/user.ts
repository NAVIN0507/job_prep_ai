import { pgTable, varchar } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaHelper";
import { relations } from "drizzle-orm";
import { JobInfoTable } from "./jobinfo";

export const UsersTable = pgTable("users" , {
  id:varchar().primaryKey(),
  email:varchar().notNull().unique(),
  name:varchar().notNull(),
  imageUrl:varchar().notNull(),
  createdAt,
  updatedAt
})

export const userRelations = relations(UsersTable , ({many})=>({
  jobInfos:many(JobInfoTable)
}))