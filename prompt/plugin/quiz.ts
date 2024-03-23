import { ChatCompletionRequestMessageRoleEnum } from "openai-edge";


export default function getQuizGenMsgList ({
  topic, type, showCorrectAnswer,
} : {
  topic: string,
  type: string,
  showCorrectAnswer: boolean,
}) {
  
  const DEFAULT_MESSAGES = [
    {
      "role": ChatCompletionRequestMessageRoleEnum.System,
      "content": `Create a quiz based on a given topic. Show correct answer after user submits answer: if ${showCorrectAnswer}\n\n

      Respond in the following JSON format. Don't include "\`\`\`json" in your response.
      
      - \`question\`: Craft a clear and concise question text.
      - \`type\`: Specify the type of question (e.g., "multiple-choice").
      - \`possibleAnswers\`: List the options for multiple-choice questions or the expected keywords for open-ended questions.
      - \`showAnswer\`: Set to \`true\` to show the correct answer after the user's submission.
      - \`answer\`: Provide the correct answer.
      - \`explanation\`: Offer a brief explanation for why this is the correct answer, linking back to the content.
      - \`source\`: Optionally, include a reference to the specific section of the Markdown content that the question is based on.
      `
    },
  ];

  return ([
    ...DEFAULT_MESSAGES,
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: `Create a ${type} quiz on ${topic}. Show correct answer after user submits answer: ${showCorrectAnswer}. Respond `,
    }
  ])
}