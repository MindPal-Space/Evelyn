"use client";

import React, { useState } from 'react';
import { useActions, useUIState } from "ai/rsc";
import { AI } from "@/app/action";
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from '../ui/toast';
import { MemoizedReactMarkdown } from '../markdown';
import { UserMessage } from '../message';
import { Button } from '../ui/button';
import { nanoid } from 'ai';
import { Card } from '../ui/card';

// @ts-ignore
export default function QuizQuestion({ question, questionType, possibleAnswers, showAnswer, answer, explanation, source }) {
  
  const [answerUI, setAnswerUI] = useState<boolean>(false);
  const toast = useToast();
  const [selectedOption, setSelectedOption] = useState(questionType === 'multiple-choice' ? [] : '');
  const [, setMessages] = useUIState<typeof AI>();
  const { submitAnswer } = useActions<typeof AI>();
  const isMultipleChoice = questionType === 'multiple-choice';
  const handleOptionChange = (e: any) => {
    const value = e.target.value;
    if (isMultipleChoice) {
      setSelectedOption(prev => 
        // @ts-ignore
        prev.includes(value) ? prev.filter(option => option !== value) : [...prev, value]
      );
    } else {
      setSelectedOption(value);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isMultipleChoice && selectedOption.length === 0) {
      toast.toast({
        title: "No option selected",
        description: "Please select at least one option.",
        action: <ToastAction altText="Okay">Okay</ToastAction>,
      });
      return;
    } else if (!isMultipleChoice && !selectedOption) {
      toast.toast({
        title: "No option selected",
        description: "Please select an option.",
        action: <ToastAction altText="Okay">Okay</ToastAction>,
      });
      return;
    }
    // Add user message UI
    setMessages((currentMessages: any[]) => [
      ...currentMessages,
      {
        id: nanoid(),
        display: <UserMessage>{`My answer is: "${selectedOption}"`}</UserMessage>,
      },
    ]);

    // @ts-ignore
    const response = await submitAnswer(selectedOption);
    setAnswerUI(response.answerUI)
    // Insert a new system message to the UI.
    setMessages((currentMessages: any[]) => [
      ...currentMessages,
      response.newMessage,
    ]);

  };

  return (
    <Card className="p-4 w-full flex flex-col gap-0 items-start justify-center">
      <MemoizedReactMarkdown>
        {question}
      </MemoizedReactMarkdown>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* @ts-ignore */}
          {possibleAnswers.map((option, index) => (
            <label key={index} className="flex items-center">
              <input
                className={isMultipleChoice ? "form-checkbox h-5 w-5" : "form-radio h-5 w-5"}
                name={isMultipleChoice ? `option_${index}` : "quiz"}
                type={isMultipleChoice ? "checkbox" : "radio"}
                value={option}
                onChange={handleOptionChange}
                // For multiple choice, check if the option is included in the selected options
                // @ts-ignore
                checked={isMultipleChoice ? selectedOption.includes(option) : selectedOption === option}
              />
              <span className="ml-2 prose">
                <MemoizedReactMarkdown>
                  {option}
                </MemoizedReactMarkdown>
              </span>
            </label>
          ))}
        </div>
        <div className="mt-6">
          <Button type="submit" disabled={answerUI}>
            Submit answer
          </Button>
        </div>
      </form>
    </Card>
  );
}
