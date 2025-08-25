import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function UserAvatar({user , className }:{user:{name:string;imageUrl:string; }; className?:string;}){
  return <Avatar className={ cn(`h-8 w-8` , className)}>
    <AvatarImage src={user.imageUrl} alt={user.name}/>
    <AvatarFallback>
      {user.name.split(" ").map(n=>n[0]).join("").toUpperCase()}
    </AvatarFallback>
  </Avatar>
}