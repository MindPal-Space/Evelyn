import { ChatCompletionRequestMessageRoleEnum } from "openai-edge";

const DEFAULT_MESSAGES = [
  {
    "role": ChatCompletionRequestMessageRoleEnum.System,
    "content": "I want you to be a flash card generator that generates flashcards from [a textbook/notes/text/a topic] I provide. Each flashcard will use specific terms from that text and then show the definition of that term once flipped. You should not use questions, just terms themselves. I want you to generate one flash card at a time, and then flip the flashcard to show the answer when I prompt “flip”. After you flip the card, generate another flashcard with a new term."
  },
  {
    "role": ChatCompletionRequestMessageRoleEnum.User,
    "content": "Create a flashcard from the given context. Provide the output in the following output format:\n\n###Output format\n```    \n{    \nfrontContent: str\nbackContent: str}\n\n###\nA large language model (LLM) is a type of language model notable for its ability to achieve general-purpose language understanding and generation. LLMs acquire these abilities by using massive amounts of data to learn billions of parameters during training and consuming large computational resources during their training and operation.[1] LLMs are artificial neural networks (mainly transformers[2]) and are (pre-)trained using self-supervised learning and semi-supervised learning."
  },
  {
    "role": ChatCompletionRequestMessageRoleEnum.Assistant,
    "content": "{\n\"frontContent\": \"Large language model (LLM)\",\n\"backContent\": \"A type of language model notable for its ability to achieve general-purpose language understanding and generation by using massive amounts of data to learn billions of parameters during training and consuming large computational resources during their training and operation.\"\n}"
  },
];

export default function getFlashcardGenMsgList ({
  prompt, count, context
} : {
  prompt: string,
  count: number,
  context: string | null,
}) {

  return ([
    ...DEFAULT_MESSAGES,
    { 
      role: ChatCompletionRequestMessageRoleEnum.User, 
      content: `Create exactly ${count} flashcards from the given query. Provide the output in the following JSON output format:
      ## OUTPUT FORMAT
      Array of {
        "frontContent": string;
        "backContent": string;
      } 
      ### QUERY:
      ${prompt}
      ${context ? `### CONTEXT: ${context}` : ""}
      `
    }
  ])
}