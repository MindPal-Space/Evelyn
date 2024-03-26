import getQuizGenMsgList from "@/prompt/plugin/quiz";
import OpenAI from "openai";

export async function generateQuiz (topic: string, type: string) {

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0125',
    stream: false,
    messages: getQuizGenMsgList({
      topic,
      type, 
      showCorrectAnswer: false,
    }),
  });

  return {
    ...JSON.parse(response.choices[0]?.message.content || "")
  };
}