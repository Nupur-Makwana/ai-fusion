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
import { MessageSquare, Lock } from 'lucide-react'; // Added Lock icon
import { Button } from '@/components/ui/button';

function AiMultiModels() {
    const [aiModelList, setAiModelList] = useState(AiModelList);

    const onToggleChange = (modelName, value) => {
        setAiModelList((prev) =>
            prev.map((m) =>
                m.model === modelName ? { ...m, enable: value } : m
            )
        );
    };

    return (
        <div className='flex w-full h-full border-b overflow-x-auto overflow-y-hidden bg-background'>
            {aiModelList.map((model, index) => (
                <div key={index}
                    className={`flex flex-col border-r h-full transition-all duration-300 relative ${model.enable !== false ? 'min-w-[300px] flex-1' : 'min-w-[75px] w-[75px]'
                        } bg-card`}>

                    <div className={`flex w-full items-center p-3 border-b sticky top-0 bg-background/90 backdrop-blur-sm ${model.enable !== false ? 'justify-between' : 'justify-center flex-col gap-4'
                        }`}>
                        <div className={`flex items-center gap-2 ${model.enable === false && 'flex-col'}`}>
                            <Image src={model.icon} alt={model.model} width={22} height={22} />

                            {model.enable !== false && (
                                <Select disabled={model.premium}> {/* Disable select if premium */}
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
                            )}
                        </div>

                        <div className='flex items-center'>
                            {model.enable !== false ? (
                                <Switch
                                    checked={model.enable ?? true}
                                    onCheckedChange={(v) => onToggleChange(model.model, v)}
                                    className="scale-75 border border-zinc-400 dark:border-zinc-500 data-[state=unchecked]:bg-zinc-300 dark:data-[state=unchecked]:bg-zinc-700 data-[state=checked]:bg-blue-600"
                                />
                            ) : (
                                <MessageSquare
                                    className="h-5 w-5 cursor-pointer text-blue-500 hover:text-blue-600"
                                    onClick={() => onToggleChange(model.model, true)}
                                />
                            )}
                        </div>
                    </div>

                    {/* Main Chat Instance Area */}
                    <div className="flex-1 overflow-y-auto p-4 text-xs text-muted-foreground italic relative">
                        {model.model} Chat Instance...

                        {/* Premium Lock Overlay */}
                        {model.premium && model.enable !== false && (
                            <div className='absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center z-20'>
                                <Button className="rounded-full shadow-lg gap-2">
                                    <Lock className='h-4 w-4' />
                                    Upgrade to unlock
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AiMultiModels;