import { ConnectionMessage } from "@humeai/voice-react";
import { JsonMessage, ReturnChatEvent } from "hume/api/resources/empathicVoice";

type Message = JsonMessage | ConnectionMessage | ReturnChatEvent
export function condensedChatMessages(messages:Message[]
){
    
}