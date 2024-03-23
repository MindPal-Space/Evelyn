import { ChatCompletionRequestMessageRoleEnum } from "openai-edge";

const DEFAULT_MESSAGES = [
  {
    "role": ChatCompletionRequestMessageRoleEnum.System,
    "content": "You are an excellent carousel post  UX writer. Your task is designing the carousel post from the given input. The output will be a list of slide string in markdown format.\n\n###The output must be in the following format:\n\nstring[] // list of slide string in markdown format"
  },
  {
    "role": ChatCompletionRequestMessageRoleEnum.User,
    "content": "for someone who is a business student self-teaching frontend development like me it seems like an unbelieable thing when i learned and able to code 2 web apps in just 2 months but i believe there's not all magic there's a reason why. i know my why. i know frontend has always been the pain point for my startup so i wanted to learn to solve that. moreover, i overcome my self-doubts, the inside thoughts that told me i'm not capable and smart to do it. furthermore, i have got a big picture of what i needed to learn and not just learn without a direction. lastly, i'm very consistent meaning i devoted at least 1 hr each day to learn.\n"
  },
  {
    "role": ChatCompletionRequestMessageRoleEnum.Assistant,
    "content": `["# 🌟\\n ## Unlocking the Power of Frontend Development\\n","\\n ## 🚀\\n ### My Unbelievable Journey\\n In just 2 months, as a business student teaching myself frontend development, I achieved something extraordinary. I coded not just one, but TWO web apps! 💪\\n","\\n ## 💡\\n ### Finding My Why\\n Frontend has always been the pain point for my startup, and I was determined to find a solution. That's why I embarked on this self-teaching journey. I knew my \"why\" and that fueled my passion to learn. 🔥\\n","\\n ## 💪\\n ### Overcoming Self-Doubt\\n Self-doubt whispered in my ear, telling me I wasn't capable or smart enough. But I silenced those thoughts and proved them wrong. I pushed beyond my limits and discovered my true potential. 🌟\\n","\\n ## 🎯\\n ### Learning with Purpose\\n I didn't want to aimlessly absorb knowledge. I had a clear vision of what I needed to learn and the skills that would make a difference for my startup. Each step was intentional and directed towards my goals. 📚\\n","\\n ## ⏰\\n ### Consistency is Key\\n Devoting at least 1 hour every day, I made consistent progress. It wasn't always easy, but I stayed committed to my learning journey. Small steps each day led to remarkable results. 📆\\n","\\n ## 📣\\n ### Join Me on this Incredible Journey!\\n If I can unlock the power of frontend development, so can you! Let's chase our dreams, overcome obstacles, and build something amazing together. Tag a friend who needs to see this and let's start coding! 💻💪\\n"]`,
  }
];

export default function getCarouselGenMsgList ({
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