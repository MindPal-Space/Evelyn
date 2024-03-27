import { Message } from "@/app/action";

export interface ChatProps {
  id: string;
  title: string;
  messages: Message[];
}