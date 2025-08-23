import { experienceLevel } from "@/drizzle/schema";
import z from "zod";

export const jobInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  title: z.string().min(1).nullable(),
  experienceLevel: z.enum(experienceLevel),
  description: z.string().min(10, "Description must be at least 10 characters"),
});