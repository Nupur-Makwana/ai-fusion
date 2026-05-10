"use client"
import React, { useContext, useEffect, useState } from 'react'
import { Paperclip, Mic, SendHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext';
import axios from 'axios';

function ChatInputBox() {
  const [userInput, setUserInput] = useState("");
  const { aiSelectedModels, messages, setMessages } = useContext(AiSelectedModelContext);

  const handleSend = async () => {
    // FIX: Typo in userInout -> userInput
    if (!userInput || !userInput.trim()) return;

    const currentInput = userInput; 
    setUserInput(""); // Reset input immediately for better UX

    // 1. Add user message to all models in the state
    setMessages((prev) => {
      const updated = { ...prev };
      Object.keys(aiSelectedModels).forEach((modelKey) => {
        updated[modelKey] = [
          ...(updated[modelKey] ?? []),
          { role: "user", content: currentInput },
        ];
      });
      return updated;
    });

    // 2. Fetch responses from each enabled model
    // FIX: aiSelectedModles -> aiSelectedModels
    Object.entries(aiSelectedModels).forEach(async ([parentModel, modelInfo]) => {
      if (!modelInfo.modelId) return;

      // Add loading placeholder
      setMessages((prev) => ({
        ...prev,
        [parentModel]: [
          ...(prev[parentModel] ?? []),
          { role: "assistant", content: "Thinking...", model: parentModel, loading: true },
        ],
      }));

      try {
        const result = await axios.post("/api/ai-multi-model", {
          model: modelInfo.modelId,
          msg: [{ role: "user", content: currentInput }], // Or pass full history here
          parentModel,
        });

        // FIX: Extract correctly from your API response
        const { aiResponse } = result.data;

        setMessages((prev) => {
          // FIX: Typo pev -> prev, and accessing prev[parentModel] safely
          const currentModelMessages = [...(prev[parentModel] ?? [])];
          const loadingIndex = currentModelMessages.findIndex((m) => m.loading);

          if (loadingIndex !== -1) {
            currentModelMessages[loadingIndex] = {
              role: "assistant",
              content: aiResponse, // FIX: context -> content
              model: parentModel,
              loading: false,
            };
          }
          return { ...prev, [parentModel]: currentModelMessages };
        });

      } catch (err) {
        console.error("Error for model " + parentModel, err);
        setMessages((prev) => ({
          ...prev,
          [parentModel]: [
            ...(prev[parentModel] ?? []).filter(m => !m.loading), // Remove loading msg on error
            { role: "assistant", content: "Error fetching response.", model: parentModel },
          ],
        }));
      }
    });
  };

  return (
    <div className='fixed bottom-0 left-0 w-full flex justify-center px-4 pb-4 bg-transparent pointer-events-none'>
      <div className='w-full border rounded-xl shadow-md max-w-2xl p-4 flex flex-col gap-2 bg-background pointer-events-auto'>
        <input 
          type='text' 
          value={userInput} // FIX: Control the input
          placeholder='Ask me anything...'
          className='border-0 outline-none w-full bg-transparent text-sm'
          onChange={(event) => setUserInput(event.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()} // FIX: Send on Enter key
        />

        <div className='flex justify-between items-center mt-2'>
          <div className='flex gap-2'>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>

          <div className='flex gap-2 items-center'>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Mic className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              className="h-8 w-8 bg-orange-600 hover:bg-orange-700" 
              onClick={handleSend}
            >
              <SendHorizontal className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInputBox;