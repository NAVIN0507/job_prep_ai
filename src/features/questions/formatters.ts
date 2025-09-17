import { QusetionDeficulties } from "@/drizzle/schema"

export function formatQuestionDifficulty(difficulty: QusetionDeficulties) {
    switch (difficulty) {
        case "easy":
            return "Easy"
        case "medium":
            return "Medium"
        case "hard":
            return "Hard"
        default:
            throw new Error(
                `Unknown question difficulty: ${difficulty satisfies never}`
            )
    }
}