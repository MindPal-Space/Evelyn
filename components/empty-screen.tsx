import { Button } from '@/components/ui/button';
import { IconArrowRight } from '@/components/ui/icons';
import Link from 'next/link';

export function EmptyScreen({
  submitMessage,
}: {
  submitMessage: (message: string) => void;
}) {

  const exampleMessages = [
    {
      heading: 'Start a quiz about planet facts',
    },
    {
      heading: 'Generate a mindmap about marketing principles',
    },
    {
      heading: 'Give me some flashcards about artificial intelligence',
    },
  ];
  return (
    <div className="mx-auto max-w-2xl px-4">
    <div className="rounded-lg border bg-background p-8 mb-4">
      <h1 className="mb-2 text-lg font-semibold">
        Welcome to Evelyn!
      </h1>
      <p className="mb-2 leading-normal text-muted-foreground">
        A smart tutor that can not only provide text-based answers but also:
      </p>
      <div className="mt-4 flex flex-col items-start space-y-2 mb-4">
        {exampleMessages.map((message, index) => (
          <Button
            key={index}
            variant="link"
            className="h-auto p-0 text-base"
            onClick={async () => {
              submitMessage(message.heading);
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
