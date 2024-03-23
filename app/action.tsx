import 'server-only';
import { createAI, getMutableAIState, render } from 'ai/rsc';
import OpenAI from 'openai';
import { z } from 'zod';
import { generateMindmap, MarkmapCard } from '@/components/markmap';
import { FlashcardListCard, generateFlashcardList } from '@/components/flashcards';
import { BotMessage, BotCard } from '@/components/quiz/message';
import { spinner } from '@/components/quiz/spinner';
import QuizQuestion from '@/components/quiz/quiz-question';
import { generateQuiz } from '@/components/quiz';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

async function submitAnswer(answer: string) {
  'use server';
  const response = await submitUserMessage(`${answer}`);
  return {
    answerUI: true,
    newMessage: response,
  };
}

async function submitUserMessage(content: string) {
  'use server';
  const aiState = getMutableAIState<typeof AI>();
  aiState.update([
    ...aiState.get(),
    {
      role: 'user',
      content,
    },
  ]);


  const ui = render({
    provider: openai,
    model: 'gpt-3.5-turbo-0125',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful teaching assistant that deploys different methods to engage/help your students in their learning. Ask follow-up questions to get sufficient input before doing anything. DONT make up information.'
      },
      ...aiState.get().map((info: any) => ({
        role: info.role,
        content: info.content,
        name: info.name,
      })),
    ],
    initial: <BotMessage className="items-center">{spinner}</BotMessage>,
    // @ts-ignore
    text: ({content, done}) => {
      if (done) {
        aiState.done([...aiState.get(), { role: 'assistant', content }]);
      }
      return <BotMessage>{content}</BotMessage>;
    },
    tools: {
      // MARKMAP
      generate_mindmap: {
        description: "Generate a mindmap based on a topic",
        parameters: z.object({
          topic: z.string().describe("The topic about which the mindmap will be generated")
        }).required(),
        render: async function* ({ topic } : { topic: string }) {
          yield <BotMessage className="items-center">{spinner}</BotMessage>;
          const result = await generateMindmap(topic);
          const nextAIStateItem = {
            role: "function",
            name: "generate_mindmap",
            content: JSON.stringify(result),
          };
          aiState.done([
            ...aiState.get(),
            nextAIStateItem,
          ]);
          return <BotMessage><MarkmapCard {...result} /></BotMessage>;
        },  
      },
      // FLASHCARDS
      generate_flashcards: {
        description: "Generate flashcards based on a given topic",
        parameters: z.object({
          topic: z.string().describe("The topic about which the flashcards will be generated")
        }).required(),
        render: async function* ({ topic } : { topic: string }) {
          yield <BotMessage className="items-center">{spinner}</BotMessage>;
          const result = await generateFlashcardList(topic);
          const nextAIStateItem = {
            role: "function",
            name: "generate_flashcards",
            content: JSON.stringify(result),
          };
          aiState.done([
            ...aiState.get(),
            nextAIStateItem,
          ]);
          return <BotMessage><FlashcardListCard {...result} /></BotMessage>;
        },  
      },
      // QUIZ
      generate_quiz: {
        description: 'Generate a quiz question with possible answers, and manage user interactions.',
        parameters: z.object({
          topic: z.string().describe('The topic of the question to generate.'),
          type: z.enum(['multiple-choice', 'single-choice', 'boolean'])
            .describe('The type of the question.'),
          possibleAnswers: z.array(z.string())
            .describe('An array of possible answers for the question.'),
        }).required(),
        /// @ts-ignore
        render: async function* ({ topic, type, possibleAnswers }) {
          yield <BotCard>{spinner}</BotCard>;
          const result = await generateQuiz(topic, type);
          const nextAIStateItem = {
            role: "function",
            name: "generate_quiz",
            content: JSON.stringify(result),
          };
          aiState.done([
            ...aiState.get(),
            nextAIStateItem,
          ]);
          // Update the AI state with the current question details
          aiState.done([
            ...aiState.get(),
            {
              role: 'function',
              name: 'generate_quiz',
              content: JSON.stringify(result),
            },
          ]);
          // Update the UI with the current question
          return <BotCard>
            <QuizQuestion {...result} />
          </BotCard>;

        }
      },
    }
  });

  return {
    id: Date.now(),
    display: ui,
  };
}

// Define necessary types and create the AI.

const initialAIState: {
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  id?: string;
  name?: string;
}[] = [];

const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

export const AI: any = createAI({
  actions: {
    submitUserMessage,
    submitAnswer,
  },
  initialUIState,
  initialAIState,
});
