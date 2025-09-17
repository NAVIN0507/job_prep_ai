import { db } from "@/drizzle/db"
import { QuestionsTable } from "@/drizzle/schema"

export async function insertQuestion(
    question: typeof QuestionsTable.$inferInsert
) {
    const [newQuestion] = await db
        .insert(QuestionsTable)
        .values(question)
        .returning({
            id: QuestionsTable.id,
            jobInfoId: QuestionsTable.jobInfoId,
        })



    return newQuestion
}