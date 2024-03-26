import getMarkmapGenMsgList from '@/prompt/plugin/markmap';
import OpenAI from 'openai';
import { Card } from '../ui/card';
import MarkmapDisplay from './display';

export function MarkmapCard ({ markdownContent } : any) {
  return (
    <Card className="w-full h-[20rem] flex items-center justify-center">
      <MarkmapDisplay markdownContent={markdownContent} />
    </Card>
  );
}
 
export async function generateMindmap (topic: string) {

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0125',
    stream: false,
    messages: getMarkmapGenMsgList({
      prompt: topic,
      context: null,
    }),
  });

  return {
    markdownContent: response.choices[0]?.message.content || "",
  };
}