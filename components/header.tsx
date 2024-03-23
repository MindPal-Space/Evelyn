import Link from 'next/link';

import {
  IconSeparator,
} from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { HomeIcon, MagicWandIcon } from '@radix-ui/react-icons';

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full px-4 border-b h-14 shrink-0 bg-background backdrop-blur-xl">
      <span className="inline-flex items-center home-links whitespace-nowrap">
        <a href="https://everlearns.com" rel="noopener" target="_blank">
          <Image src={"/logo.png"} alt="EverLearns Logo" width={100} height={100} className="h-6 w-auto aspect-auto" />
        </a>
        <IconSeparator className="w-6 h-6 text-muted-foreground/20" />
        <Link href="/">
          <span className="text-lg font-semibold">
            AI Tutor Demo
          </span>
        </Link>
      </span>
      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" asChild>
          <a
            target="_blank"
            href="https://everlearns.com"
            rel="noopener noreferrer"
          >
            <MagicWandIcon />
            <span className="hidden ml-2 md:flex">AI Course Creation Tool</span>
          </a>
        </Button>
        <Button asChild>
          <a
            href="https://www.facebook.com/groups/aiforeducator"
            target="_blank"
          >
            <HomeIcon className="mr-2" />
            <span className="hidden sm:block">AI for Educators Community</span>
          </a>
        </Button>
      </div>
    </header>
  );
}
