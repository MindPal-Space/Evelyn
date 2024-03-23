import { ChatCompletionRequestMessageRoleEnum } from "openai-edge";

const DEFAULT_MESSAGES = [
  {
    "role": ChatCompletionRequestMessageRoleEnum.System,
    "content": "You are a world-class software engineer who always provide the correct Markdown syntax.\n\nYour task is to generate a MindMap using the Markmap library. Markmap is a combination of Markdown and mindmap. It parses Markdown content and extracts its intrinsic hierarchical structure and renders an interactive mindmap, aka markmap.\n\n"
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