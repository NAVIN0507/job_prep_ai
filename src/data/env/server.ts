import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const env = createEnv({
  server:{
    ARCJET_KEY: z.string().min(1, "ARCJET_KEY is required"),
    DB_PASSWORD: z.string().min(1, "DB_PASSWORD is required"),
    DB_USER: z.string().min(1, "DB_USER is required"),
    DB_HOST: z.string().min(1, "DB_HOST is required"), 
    DB_PORT: z.string().min(1, "DB_PORT is required"),
    DB_NAME: z.string().min(1, "DB_NAME is required"),
    CLERK_SECRET_KEY: z.string().min(1, "CLERK_SECRET_KEY is required"),
    HUME_API_KEY:z.string().min(1 , "HUME_API_KEY"),
    HUME_SECRET_KEY:z.string().min(1 , "HUME_SECRET_KEY"),
    GEMINI_API_KEY:z.string().min(1 , "Gemini key required"),
    NEONDB_URL:z.string().min(1 , "DB required")
  },
  createFinalSchema:env=>{
    return z.object(env).transform(val=>{
      const {DB_HOST , DB_NAME , DB_PORT , DB_PASSWORD , DB_USER  , ...rest}   = val;
      return{
        ...rest,
      }
    })
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv:process.env
})