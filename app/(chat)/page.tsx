import Chat from "@/components/chat";
import { nanoid } from "ai";
import { AI } from "../action";

export default function IndexPage() {

  return (
    <AI initialUIState={{ id: nanoid(), messages: [] }}>
      <Chat />
    </AI>
  )
}