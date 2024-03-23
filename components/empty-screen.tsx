import { Button } from '@/components/ui/button';
import { IconArrowRight } from '@/components/ui/icons';
import Link from 'next/link';

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomElements(arr: any[], count: any) {
  return arr.filter((item) => ['reactjs', 'javascript', 'python'].includes(item.topic))
}

function generateMessage(topic: string) {
  const sentenceVariants = [
    `Start a quiz on ${capitalizeFirstLetter(topic)}`,
  ];
  const randomIndex = Math.floor(Math.random() * sentenceVariants.length);
  return sentenceVariants[randomIndex];
}


export function EmptyScreen({
  submitMessage,
}: {
  submitMessage: (message: string) => void;
}) {

  const exampleMessages = [
    {
      heading: 'Start a quiz',
      message: 'Start a quiz',
    },
    {
      heading: 'Generate a mindmap',
      message: 'Generate a mindmap',
    },
    {
      heading: 'Give me some flashcards',
      message: 'Give me some flashcards',
    },
  ];
  return (
    <div className="mx-auto max-w-2xl px-4">
    <div className="rounded-lg border bg-background p-8 mb-4">
      <h1 className="mb-2 text-lg font-semibold">
        Welcome to EverLearns AI Tutor Demo!
      </h1>
      <p className="mb-2 leading-normal text-muted-foreground">
        Imagine an AI tutor that not only provides text-based answers to your students' questions but is also smart enough to utilize various interfaces such as <span className='font-bold'>quizzes, flashcards, and mind maps</span> for <span className='font-bold'>interactive</span> engagement.
      </p>
      <p className="mb-2 leading-normal text-muted-foreground">
        It's EverLearns AI Tutor, and this is her early demo.
      </p>
      <p className="mb-2 leading-normal text-muted-foreground">
        Soon, you will be able to train EverLearns AI Tutor on <span className='font-bold'>ALL your teaching materials</span>, such as books, lectures, slides, papers, and more.
      </p>
      <p className="mb-2 leading-normal text-muted-foreground">
        Excited? Join our waitlist to be among the first to bring this AI Tutor to your school. 
      </p>
      <div className="mt-4 flex flex-col items-start space-y-2 mb-4">
        {exampleMessages.map((message, index) => (
          <Button
            key={index}
            variant="link"
            className="h-auto p-0 text-base"
            onClick={async () => {
              submitMessage(message.message);
            }}
          >
            <IconArrowRight className="mr-2 text-muted-foreground" />
            {message.heading}
          </Button>
        ))}
      </div>
    </div>
    <p className="leading-normal text-muted-foreground text-[0.8rem] text-center max-w-96 ml-auto mr-auto">
      Part of <Link href={"https://everlearns.com"} className="font-bold text-primary" target={"_blank"}>EverLearns</Link>, developed by <Link href={"https://mindpal.io/"} className="font-bold text-primary" target={"_blank"}>MindPal Labs</Link>
    </p>
  </div>

  );
}
