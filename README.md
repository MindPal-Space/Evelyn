<a href="https://chat.everlearns.co">
  <h1 align="center">Evelyn Smart Tutor</h1>
</a>

<p align="center">
  An AI tutor that engages - an experiment using Generative UI
</p>

## Features

- [Next.js](https://nextjs.org) App Router + React Server Components
- [Vercel AI SDK 3.0](https://sdk.vercel.ai/docs) for Generative UI
- OpenAI Tools/Function Calling
- [shadcn/ui](https://ui.shadcn.com)

## Quick Links

- [See the demo](https://youtu.be/Svm9ZItg6U8)
- This project is inspired by the great demo from [anis-marrouchi](https://github.com/anis-marrouchi), check it [here](https://github.com/anis-marrouchi/vercel-ai-sdk-quiz)


## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js AI Chatbot. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various OpenAI and authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

