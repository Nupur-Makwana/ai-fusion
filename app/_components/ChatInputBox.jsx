"use client"
import React, { useContext, useState } from 'react'
import { Paperclip, Mic, SendHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext';
import AiModelList from './../../shared/AiModelList';
import axios from 'axios';

function ChatInputBox() {
  const [userInput, setUserInput] = useState("");
  const { aiSelectedModels, setMessages } = useContext(AiSelectedModelContext);

  const handleSend = async () => {
    if (!userInput || !userInput.trim()) return;

    const currentInput = userInput;
    setUserInput("");
    
    const allowedModels = Object.entries(aiSelectedModels).filter(([parentModel, modelInfo]) => {
      const category = AiModelList.find(m => m.model === parentModel);
      const subModel = category?.subModel.find(s => s.id === modelInfo.modelId);

      const isEnabled = modelInfo.enable !== false;

      
      return isEnabled && !category?.premium && !subModel?.premium;
    });

    // 2. Add user message ONLY to allowed models
    setMessages((prev) => {
      const updated = { ...prev };
      allowedModels.forEach(([parentModel]) => {
        updated[parentModel] = [
          ...(updated[parentModel] ?? []),
          { role: "user", content: currentInput },
        ];
      });
      return updated;
    });

    // 3. Loop only through allowed models for API calls
    allowedModels.forEach(async ([parentModel, modelInfo]) => {
      // Add loading state
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
          msg: [{ role: "user", content: currentInput }],
          parentModel,
        });

        const { aiResponse } = result.data;

        setMessages((prev) => {
          const currentModelMessages = [...(prev[parentModel] ?? [])];
          const loadingIndex = currentModelMessages.findIndex((m) => m.loading);
          if (loadingIndex !== -1) {
            currentModelMessages[loadingIndex] = {
              role: "assistant",
              content: aiResponse,
              model: parentModel,
              loading: false,
            };
          }
          return { ...prev, [parentModel]: currentModelMessages };
        });
      } catch (err) {
        setMessages((prev) => ({
          ...prev,
          [parentModel]: [
            ...(prev[parentModel] ?? []).filter(m => !m.loading),
            { role: "assistant", content: "Error fetching response." },
          ],
        }));
      }
    });
  };

  return (
    <div className='fixed bottom-0 left-0 w-full flex justify-center px-4 pb-6 bg-transparent pointer-events-none z-50'>
      <div className='w-full border rounded-xl shadow-lg max-w-2xl p-4 flex flex-col gap-2 bg-background pointer-events-auto'>
        <input
          type='text'
          value={userInput}
          placeholder='Ask me anything...'
          className='border-0 outline-none w-full bg-transparent text-sm'
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <div className='flex justify-between items-center mt-2'>
          <div className='flex gap-2'>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Paperclip className="h-4 w-4" /></Button>
          </div>
          <div className='flex gap-2 items-center'>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Mic className="h-4 w-4" /></Button>
            <Button size="icon" className="h-8 w-8 bg-orange-600 hover:bg-orange-700" onClick={handleSend}>
              <SendHorizontal className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInputBox;