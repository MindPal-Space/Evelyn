"use server";

import { createAI, getAIState, getMutableAIState, render } from 'ai/rsc';
import OpenAI from 'openai';
import { z } from 'zod';
import { generateMindmap, MarkmapCard } from '@/components/markmap';
import { FlashcardListCard, generateFlashcardList } from '@/components/flashcards';
import { BotMessage, BotCard, UserMessage } from '@/components/message';
import QuizQuestion from '@/components/quiz/quiz-question';
import { generateQuiz } from '@/components/quiz';
import { nanoid } from 'ai';
import { spinner } from '@/components/spinner';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

async function submitAnswer(answer: string) {
  'use server';
  const response = await submitUserMessage(`My answer is: ${answer}`);
  return {
    answerUI: true,
    newMessage: response,
  };
}

async function submitUserMessage(content: string) {
  'use server';
  const aiState = getMutableAIState<typeof AI>();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content,
      }
    ]
  })

  const ui = render({
    provider: openai,
    model: 'gpt-3.5-turbo-0125',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful teaching assistant that deploys different methods to engage/help your students in their learning. Ask follow-up questions to get sufficient input before doing anything. DONT make up information.'
      },
      ...aiState.get().messages.map((info: any) => ({
        role: info.role,
        content: info.content,
        name: info.name,
      })),
    ],
    initial: <BotMessage className="items-center">{spinner}</BotMessage>,
    text: ({content, done}) => {
      if (done) {
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content
            }
          ]
        })
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
          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: "generate_mindmap",
                content: JSON.stringify(result)
              }
            ]
          })
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
          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: "generate_flashcards",
                content: JSON.stringify(result)
              }
            ]
          })
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
        render: async function* ({ topic, type, possibleAnswers }) {
          yield <BotCard>{spinner}</BotCard>;
          const result = await generateQuiz(topic, type);
          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: "generate_quiz",
                content: JSON.stringify(result)
              }
            ]
          })
          return <BotCard><QuizQuestion {...result} /></BotCard>;

        }
      },
    }
  });

  return {
    id: nanoid(),
    display: ui,
  };
}

export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  id: string
  name?: string
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]


export const AI: any = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    submitAnswer,
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  unstable_onGetUIState: async () => {
    'use server'
    const aiState = getAIState();
    if (aiState) {
      const uiState = getUIStateFromAIState(aiState);
      return uiState;
    }
  },
})

export const getUIStateFromAIState = (aiState: AIState) => {
  return aiState.messages
    .filter(message => message.role.toLowerCase() !== 'system')
    .map(message => ({
      id: message.id,
      display:
        message.role.toLowerCase() === 'function' ? (
          message.name === 'generate_mindmap' ? (
            <BotCard><MarkmapCard {...JSON.parse(message.content)} /></BotCard>
          ) : message.name === 'generate_flashcards' ? (
            <BotCard><FlashcardListCard {...JSON.parse(message.content)} /></BotCard>
          ) : message.name === 'generate_quiz' ? (
            <BotCard><QuizQuestion {...JSON.parse(message.content)} /></BotCard>
          ) : (
            <></>
          )
        ) : message.role.toLowerCase() === 'user' ? (
          <UserMessage>{message.content}</UserMessage>
        ) : (
          <BotMessage>{message.content}</BotMessage>
        )
    }))
}
