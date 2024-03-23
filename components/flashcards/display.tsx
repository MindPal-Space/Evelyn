"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { FlashcardProps } from ".";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface FlashcardsDisplayProps {
  flashcardList: FlashcardProps[];
}
export default function FlashcardsDisplay ({
  flashcardList,
} : FlashcardsDisplayProps) {

  const [ currentPage, setCurrentPage]  = useState<number>(0);
  const [ isFront, setIsFront ] = useState<boolean>(true);
  useEffect(() => {
    setIsFront(true);
  }, [currentPage])

  return (
    <div className="w-full px-4 flex flex-col items-center gap-4">
      <Card className="p-8 w-full flex flex-col items-center justify-center gap-8">
        <Badge variant="secondary">
          {isFront ? "Front" : "Back"}
        </Badge>
        <p className={`${isFront ? "font-bold" : ""} text-center text-xl`}>
          {isFront ? flashcardList[currentPage]?.frontContent : flashcardList[currentPage]?.backContent}
        </p>
        <Button
          onClick={() => setIsFront(!isFront)}
        >
          Flip
        </Button>
      </Card>
      <div className="flex items-center gap-2">
        <Button 
          onClick={() => setCurrentPage(prev => flashcardList.length === 0 ? 0 : (prev === 0 ? (flashcardList.length - 1) : (prev - 1)))}
          variant="outline" size="icon"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button 
          onClick={() => setCurrentPage(prev => flashcardList.length === 0 ? 0 : (prev === (flashcardList.length - 1) ? 0 : (prev + 1)))}
          variant="outline" size="icon"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

interface FlashcardItemProps {
  idx: number;
  flashcardData: FlashcardProps;
}
function FlashcardItem ({ flashcardData } : FlashcardItemProps) {

  return (
    <Card className="w-full p-4 flex flex-col gap-2">
      <p className="my-0 py-0 text-base font-medium">{flashcardData.frontContent}</p>
      <p className="my-0 py-0 text-sm text-default-600">{flashcardData.backContent}</p>
    </Card>
  )
}