'use client';

import { useEffect, useRef, useState } from 'react';
import { useUIState, useActions, useAIState } from 'ai/rsc';
import { BotCard, BotMessage, UserMessage } from '@/components/message';
import { ChatScrollAnchor } from '@/lib/hooks/chat-scroll-anchor';
import { FooterText } from '@/components/footer';
import Textarea from 'react-textarea-autosize';
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { IconArrowElbow, IconPlus } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { ChatList } from '@/components/chat-list';
import { EmptyScreen } from '@/components/empty-screen';
import { nanoid } from 'ai';
import { AI, AIState } from '@/app/action';
import { useRouter, useParams } from 'next/navigation';
import { ChatProps } from '@/lib/types';
import { FlashcardListCard } from '../flashcards';
import { MarkmapCard } from '../markmap';
import QuizQuestion from '../quiz/quiz-question';

export const getUIStateFromAIState = (aiState: AIState) => {
  return aiState.messages
    .filter(message => message.role.toLowerCase() !== 'system')
    .map(message => ({
      id: message.id,
      display:
        message.role.toLowerCase() === 'function' ? (
          message.name === 'generate_mindmap' ? (
            <BotCard><MarkmapCard {...JSON.parse(message.content)} /></BotCard>
          ) : message.name === 'generate_flashcards' ? (
            <BotCard><FlashcardListCard {...JSON.parse(message.content)} /></BotCard>
          ) : message.name === 'generate_quiz' ? (
            <BotCard><QuizQuestion {...JSON.parse(message.content)} /></BotCard>
          ) : (
            <></>
          )
        ) : message.role.toLowerCase() === 'user' ? (
          <UserMessage>{message.content}</UserMessage>
        ) : (
          <BotMessage>{message.content}</BotMessage>
        )
    }))
}

export default function Chat() {

  const { id } = useParams();
  const router = useRouter();

  const [ aiState, setAiState ] = useAIState<typeof AI>();
  const [ messages, setMessages ] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();
  const [inputValue, setInputValue] = useState('');
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const licenseKeyPurchaseBtnRef = useRef<HTMLButtonElement | null>(null);
  const openAiApiKeyInputBtnRef = useRef<HTMLButtonElement | null>(null); 

  useEffect(() => {
    if (id && aiState.messages.length == 0) {
      const savedChatData = localStorage.getItem("chat-" + id as string);
      if (savedChatData) {
        const chatData = JSON.parse(savedChatData) as ChatProps;
        setAiState({ chatId: chatData.id, messages: chatData.messages });
        setMessages(getUIStateFromAIState({ chatId: String(id), messages: chatData.messages }));
      }
    }
  }, [aiState, id])
 
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        if (
          e.target &&
          ['INPUT', 'TEXTAREA'].includes((e.target as any).nodeName)
        ) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (inputRef?.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputRef]);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    // Blur focus on mobile
    if (window.innerWidth < 600) {
      e.target['message']?.blur();
    }

    // If not UNLIMITED USER
    const licenseKey = localStorage.getItem('licenseKey');
    const openAiApiKey = localStorage.getItem('openAiApiKey');
    const savedChatList = Object.keys(localStorage).filter(item => item.startsWith("chat-"));
    if (!licenseKey) {
      if (savedChatList.length >= 1 && (!id || !savedChatList.includes("chat-" + id))) {
        alert("Free users cannot start more than 1 chat. Please upgrade to continue.");
        licenseKeyPurchaseBtnRef.current?.click();
        return;
      }
      if (messages.length >= 20) {
        alert("Free users can only get up to 10 AI messages per chat. Please upgrade to continue.");
        licenseKeyPurchaseBtnRef.current?.click();
        return;
      } 
    } 
    if (licenseKey && !openAiApiKey) {
      alert("Missing OpenAI API Key. Please input one to continue.");
      openAiApiKeyInputBtnRef.current?.click();
      return;
    }

    const value = inputValue.trim();
    setInputValue('');
    if (!value) return;

    // Add user message UI
    setMessages((currentMessages: any[]) => [
      ...currentMessages,
      {
        id: nanoid(),
        display: <UserMessage>{value}</UserMessage>,
      },
    ]);

    try {
      // Submit and get response message
      const responseMessage = await submitUserMessage(value);
      setMessages((currentMessages: any[]) => [
        ...currentMessages,
        responseMessage,
      ]);
    } catch (error) {
      // You may want to show a toast or trigger an error state.
      console.error(error);
    }
  };

  useEffect(() => {
    if (aiState.messages.length > 0) {
      localStorage.setItem("chat-" + (id ? id : aiState.chatId), JSON.stringify({
        ...aiState,
        title: aiState.messages[0].content.substring(0, 100) || "New chat",
      } as ChatProps));
    }
  }, [aiState.messages])

  useEffect(() => {
    if (!id && aiState.chatId && aiState.messages.length > 0) {
      router.push(`/${aiState.chatId}`);
    }
  }, [id, aiState])

  return (
    <div>
      <div className="pb-[200px] pt-4 md:pt-10">
        {messages.length ? (
          <>
            <ChatList messages={messages} />
          </>
        ) : (
          <EmptyScreen
            submitMessage={async message => {
              // Add user message UI
              setMessages((currentMessages: any[]) => [
                ...currentMessages,
                {
                  id: nanoid(),
                  display: <UserMessage>{message}</UserMessage>,
                },
              ]);

              // Submit and get response message
              const responseMessage = await submitUserMessage(message);
              setMessages((currentMessages: any[]) => [
                ...currentMessages,
                responseMessage,
              ]);
            }}
          />
        )}
        <ChatScrollAnchor trackVisibility={true} />
      </div>
      <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
        <div className="mx-auto sm:max-w-2xl sm:px-4">
          <div className="px-4 py-2 space-y-4 border-t shadow-lg bg-background sm:rounded-t-xl sm:border md:py-4">
            <form
              ref={formRef}
              onSubmit={onSubmit}
            >
              <div className="relative flex flex-col w-full px-8 overflow-hidden max-h-60 grow bg-background sm:rounded-md sm:border sm:px-12">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-0 w-8 h-8 p-0 rounded-full top-4 bg-background sm:left-4"
                      onClick={e => {
                        e.preventDefault();
                        router.push("/");
                      }}
                    >
                      <IconPlus />
                      <span className="sr-only">New Chat</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>New Chat</TooltipContent>
                </Tooltip>
                <Textarea
                  ref={inputRef}
                  tabIndex={0}
                  onKeyDown={onKeyDown}
                  placeholder="Send a message."
                  className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  name="message"
                  rows={1}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                />
                <div className="absolute right-0 top-4 sm:right-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="submit"
                        size="icon"
                        disabled={inputValue === ''}
                      >
                        <IconArrowElbow />
                        <span className="sr-only">Send message</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Send message</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </form>
            <FooterText className="hidden sm:block" licenseKeyPurchaseBtnRef={licenseKeyPurchaseBtnRef} openAiApiKeyInputBtnRef={openAiApiKeyInputBtnRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
