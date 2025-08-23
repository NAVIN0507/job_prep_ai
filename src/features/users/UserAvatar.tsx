import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserAvatar({user}:{user:{name:string;imageUrl:string}}){
  return <Avatar className="h-8 w-8">
    <AvatarImage src={user.imageUrl} alt={user.name}/>
    <AvatarFallback>
      {user.name.split(" ").map(n=>n[0]).join("").toUpperCase()}
    </AvatarFallback>
  </Avatar>
}