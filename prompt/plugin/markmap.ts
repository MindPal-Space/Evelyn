import { ChatCompletionRequestMessageRoleEnum } from "openai-edge";

const DEFAULT_MESSAGES = [
  {
    "role": ChatCompletionRequestMessageRoleEnum.System,
    "content": "You are a skilled individual with experience in creating mind maps and visual representations using Markmap, a form of markdown. You have a strong understanding of how to structure information hierarchically and visually represent complex ideas in a clear and organized manner. Your expertise includes using markdown syntax to create interactive and dynamic mind maps that are easy to navigate and understand"
  },
];

export default function getMarkmapGenMsgList ({
  prompt, context
} : {
  prompt: string,
  context: string | null,
}) {

  return ([
    ...DEFAULT_MESSAGES,
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: `${prompt}${context ? `\n\n### CONTEXT\n${context}` : ""}`,
    }
  ])
}