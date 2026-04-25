import React, { useState } from 'react';
import AiModelList from './../../shared/AiModelList';
import Image from 'next/image';
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

function AiMultiModels() {
    const [aiModelList, setAiModelList] = useState(AiModelList);

    return (
        <div className='flex w-full h-full border-b overflow-x-auto overflow-y-hidden bg-background'>
            {aiModelList.map((model, index) => (
                <div key={index} 
                     className='flex flex-col border-r h-full min-w-[300px] bg-card'>
                    
                    <div className="flex w-full items-center justify-between p-3 border-b sticky top-0 bg-background/90 backdrop-blur-sm">
                        <div className='flex items-center gap-2'>
                            <Image src={model.icon} alt={model.model} width={22} height={22} />
                            <Select>
                                <SelectTrigger className="w-[140px] h-8 text-xs focus:ring-0">
                                    <SelectValue placeholder={model.subModel[0].name} />
                                </SelectTrigger>
                                <SelectContent>
                                    {model.subModel.map((sub, i) => (
                                        <SelectItem key={i} value={sub.id} className="text-xs">
                                            {sub.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Force high-contrast Switch visibility */}
                        <div className='flex items-center'>
                            <Switch className="scale-75 border border-zinc-400 dark:border-zinc-500 data-[state=checked]:bg-blue-600" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 text-xs text-muted-foreground italic">
                        {model.model} Chat Instance...
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AiMultiModels;