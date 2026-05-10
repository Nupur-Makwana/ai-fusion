"use client"
import React, { useContext, useState } from 'react';
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
import { MessageSquare, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext';
import { useUser } from '@clerk/nextjs';
import { db } from '@/config/FirebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

function AiMultiModels() {
    const { user } = useUser();
    const [aiModelList, setAiModelList] = useState(AiModelList);
    const { aiSelectedModels, setAiSelectedModels, messages } = useContext(AiSelectedModelContext);

    const onToggleChange = (modelName, value) => {
        setAiModelList((prev) =>
            prev.map((m) =>
                m.model === modelName ? { ...m, enable: value } : m
            )
        );
    };

    const handleSubModelChange = async (modelName, subModelId) => {
        const updatedSelection = {
            ...aiSelectedModels,
            [modelName]: { modelId: subModelId }
        };
        
        setAiSelectedModels(updatedSelection);

        if (user?.primaryEmailAddress?.emailAddress) {
            try {
                const docRef = doc(db, "users", user.primaryEmailAddress.emailAddress);
                await updateDoc(docRef, {
                    selectedModelPref: updatedSelection
                });
            } catch (error) {
                console.error("Error updating firebase:", error);
            }
        }
    };

    return (
        <div className='flex w-full h-full border-b overflow-x-auto overflow-y-hidden bg-background'>
            {aiModelList.map((model, index) => (
                <div key={index}
                    className={`flex flex-col border-r h-full transition-all duration-300 relative ${
                        model.enable !== false ? 'min-w-[300px] flex-1' : 'min-w-[75px] w-[75px]'
                    } bg-card`}>

                    {/* Header Section */}
                    <div className={`flex w-full items-center p-3 border-b sticky top-0 bg-background/90 backdrop-blur-sm z-30 ${
                        model.enable !== false ? 'justify-between' : 'justify-center flex-col gap-4'
                    }`}>
                        <div className={`flex items-center gap-2 ${model.enable === false && 'flex-col'}`}>
                            <Image src={model.icon} alt={model.model} width={22} height={22} />

                            {model.enable !== false && (
                                <Select
                                    value={aiSelectedModels[model.model]?.modelId}
                                    onValueChange={(v) => handleSubModelChange(model.model, v)}
                                    disabled={model.premium}
                                >
                                    <SelectTrigger className="w-[140px] h-8 text-xs focus:ring-0">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {model.subModel.map((sub, i) => (
                                            <SelectItem
                                                key={i}
                                                value={sub.id}
                                                className="text-xs"
                                                disabled={sub.premium}
                                            >
                                                <div className="flex items-center justify-between w-full gap-5">
                                                    <span>{sub.name}</span>
                                                    {sub.premium && <Lock className="h-3 w-3 text-orange-500" />}
                                                </div>
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
                                    className="scale-75"
                                />
                            ) : (
                                <MessageSquare
                                    className="h-5 w-5 cursor-pointer text-blue-500"
                                    onClick={() => onToggleChange(model.model, true)}
                                />
                            )}
                        </div>
                    </div>

                    {/* Chat Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 relative scrollbar-hide">
                        {model.enable !== false ? (
                            <>
                                {messages[model.model]?.map((m, i) => (
                                    <div key={i}
                                        className={`p-3 rounded-lg text-sm max-w-[90%] ${
                                            m.role === 'user'
                                                ? "bg-orange-100 text-orange-900 ml-auto shadow-sm"
                                                : "bg-secondary text-secondary-foreground shadow-sm"
                                        }`}>
                                        {m.role === "assistant" && (
                                            <p className='text-[10px] font-bold opacity-50 mb-1'>
                                                {m.model ?? model.model}
                                            </p>
                                        )}
                                        <p className={m.loading ? "animate-pulse" : ""}>{m.content}</p>
                                    </div>
                                ))}

                                {/* Premium Lock Overlay */}
                                {(model.premium || model.subModel.find(s => s.id === aiSelectedModels[model.model]?.modelId)?.premium) && (
                                    <div className='absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center z-20'>
                                        <Button className="rounded-full shadow-lg gap-2">
                                            <Lock className='h-4 w-4' />
                                            Upgrade to unlock
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full opacity-20 italic text-[10px]">
                                <p>Model Disabled</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AiMultiModels;