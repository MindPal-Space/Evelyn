import OpenAI from "openai";

export const validateOpenAiApiKey = async ( openAiApiKey: string ) => {

  const openai = new OpenAI({
    apiKey: openAiApiKey,
    dangerouslyAllowBrowser: true,
  });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: false,
      messages: [
        {role: "user", content: "Hello!"},
      ],
    });
    const choice = response.choices[0]?.message.content;
    if (!choice) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};