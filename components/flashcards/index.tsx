import getFlashcardGenMsgList from "@/prompt/plugin/flashcard";
import OpenAI from "openai";
import { Card } from "../ui/card";
import FlashcardsDisplay from "./display";

export interface FlashcardProps {
  frontContent: string,
  backContent: string,
}

export function FlashcardListCard ({ flashcardList } : any) {
  return (
    <Card className="p-2 pb-4 w-full flex flex-col gap-0 items-center justify-center">
      <p className="text-sm text-gray-500">{flashcardList.length} flashcards</p>
      <FlashcardsDisplay flashcardList={flashcardList} />
    </Card>
  );
}
 
export async function generateFlashcardList (topic: string) {

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0125',
    stream: false,
    messages: getFlashcardGenMsgList({
      prompt: topic,
      context: null,
      count: 5,
    }),
  });

  return {
    flashcardList: JSON.parse(response.choices[0]?.message.content || "") as FlashcardProps[],
  };
}