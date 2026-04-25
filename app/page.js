"use client";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Image from "next/image";
import ChatInputBox from "./_components/ChatInputBox";
import AiMultiModels from "./_components/AiMultiModels";


export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      
      <div className="flex-1 min-h-0 overflow-hidden">
         <AiMultiModels />
      </div>

      <ChatInputBox />
      
    </div>
  );
}


