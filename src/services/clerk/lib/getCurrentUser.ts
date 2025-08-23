import { auth } from "@clerk/nextjs/server"
import { db} from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { UsersTable } from "@/drizzle/schema";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getUserIdTag } from "@/features/users/dbCache";
export async function getCurrentUser({allData= false}){
  const {userId , redirectToSignIn} = await auth();
  return {
userId,
redirectToSignIn,
user:allData && userId != null ? await getUser(userId) : undefined
  }
}
export async function getUser(id:string){
  "use cache"
  cacheTag(getUserIdTag(id))
return db.query.UsersTable.findFirst({
  where:eq(UsersTable.id , id)
})

}
