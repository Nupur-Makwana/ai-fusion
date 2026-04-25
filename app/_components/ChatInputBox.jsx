import React from 'react'
import { Paperclip, Mic, SendHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

function ChatInputBox() {
  return (
    <div className='fixed bottom-0 left-0 w-full flex justify-center px-4 pb-4 bg-transparent pointer-events-none'>
      {/* The actual box needs pointer-events-auto so you can click it */}
      <div className='w-full border rounded-xl shadow-md max-w-2xl p-4 flex flex-col gap-2 bg-background pointer-events-auto'>
        
        <input 
          type='text' 
          placeholder='Ask me anything...'
          className='border-0 outline-none w-full bg-transparent text-sm'
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
            <Button size="icon" className="h-8 w-8 bg-orange-600 hover:bg-orange-700">
              <SendHorizontal className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInputBox