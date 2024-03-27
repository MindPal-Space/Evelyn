'use client';

import { ChatProps } from "@/lib/types";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';


export default function PreviousChatList () {

  const chatList = Object.keys(localStorage).filter(item => item.startsWith("chat-"));

  return (
    <Dialog>
      <DialogTrigger>Previous chats</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Previous chats</DialogTitle>
          <DialogDescription>
            <ul className="mt-4 w-full flex flex-col gap-2">
              {chatList.map(item => (
                <li key={item}>
                  <Link href={`/${item.split("chat-")[1]}`} className="line-clamp-1">
                    {(JSON.parse(localStorage.getItem(item)!) as ChatProps).title}
                  </Link>
                </li>
              ))}
            </ul>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}