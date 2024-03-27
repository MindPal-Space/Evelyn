"use client";

import { validateOpenAiApiKey } from "@/server/third-party/openai";
import Link from "next/link";
import { MutableRefObject, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useRouter } from "next/navigation";

export default function OpenAiApiKeyInput ({ triggerBtnRef } : { triggerBtnRef: MutableRefObject<HTMLButtonElement | null> }) {

  const router = useRouter();

  const openAiApiKey = localStorage.getItem("openAiApiKey");
  const [ keyEditable, setKeyEditable ] = useState<boolean>(false);
  const [ keyInput, setKeyInput ] = useState<string>(openAiApiKey || "");

  const handleInputKey = async () => {
    const isValidKey = await validateOpenAiApiKey(keyInput);
    if (!isValidKey) {
      alert("Invalid OpenAI API Key.");
      return;
    }
    localStorage.setItem("openAiApiKey", keyInput);
    alert("OpenAI API key successfully updated.");
    router.refresh();
  }

  return (
    <Dialog>
      <DialogTrigger ref={triggerBtnRef}>
        <p className={openAiApiKey ? "text-lime-600" : "text-red-500"}>
          {openAiApiKey ? "Active API key" : "Missing API key"}
        </p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Manage your OpenAI API key
          </DialogTitle>
          <DialogDescription>
            <div className="w-full mt-4">
              {
                openAiApiKey ? (
                  <div className="flex flex-col gap-4 w-full">
                    <Input
                      disabled={!keyEditable}
                      type={keyEditable ? "text" : "password"}
                      placeholder="Enter Your OpenAI API Key"
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                      className="w-full"
                    />
                    {
                      !keyEditable ? (
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => setKeyEditable(true)}
                          >
                            Change key
                          </Button>
                          <Button 
                            onClick={() => {
                              const userConfirmation = confirm("Are you sure you want to delete this key?");
                              if (!userConfirmation) { return; }
                              localStorage.removeItem("openAiApiKey");
                              alert("OpenAI API key successfully deleted.");
                              window.location.reload();
                            }}
                          >
                            Delete key
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            disabled={!keyInput || !keyInput.trim()}
                            onClick={() => void handleInputKey()}
                          >
                            Save
                          </Button>
                          <Button 
                            onClick={() => setKeyEditable(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      )
                    }
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 w-full">
                    <div className="text-sm w-full flex items-center gap-2">
                      <h3>
                        Don&apos;t have an OpenAI API key?
                      </h3>
                      <Link
                        href="https://platform.openai.com/account/api-keys"
                        className="text-sm font-bold text-primary hover:text-primary-400"
                        target={"_blank"}
                      >
                        Generate one here
                      </Link>
                    </div>
                    <Input
                      type={"text"}
                      placeholder="Enter a valid OpenAI API Key"
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                      className="w-full" 
                    />
                    <div className="flex gap-2">
                      <Button 
                        disabled={!keyInput || !keyInput.trim()}
                        onClick={() => void handleInputKey()}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                )
              }
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}