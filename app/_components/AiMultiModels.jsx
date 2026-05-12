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
import ReactMarkdown from 'react-markdown'
//import remarkGfm from 'remark-gfm' 

function AiMultiModels() {
    const { user } = useUser();
    const [aiModelList, setAiModelList] = useState(AiModelList);
    const { aiSelectedModels, setAiSelectedModels, messages } = useContext(AiSelectedModelContext);

    const onToggleChange = (modelName, value) => {
        setAiModelList((prev) =>
            prev.map((m) => m.model === modelName ? { ...m, enable: value } : m)
        );

        setAiSelectedModels((prev) => ({
            ...prev,
            [modelName]: {
                ...prev[modelName],
                enable: value
            }
        }));
    };

    const handleSubModelChange = async (modelName, subModelId) => {
        const updatedSelection = {
            ...aiSelectedModels,
            [modelName]: { ...aiSelectedModels[modelName], modelId: subModelId }
        };

        setAiSelectedModels(updatedSelection);

        if (user?.primaryEmailAddress?.emailAddress) {
            try {
                const docRef = doc(db, "users", user.primaryEmailAddress.emailAddress);
                await updateDoc(docRef, { selectedModelPref: updatedSelection });
            } catch (error) {
                console.error("Error updating firebase:", error);
            }
        }
    };

    return (
        <div className='flex w-full h-screen border-b overflow-x-auto bg-background scrollbar-none'>
            {aiModelList.map((model, index) => (
                <div key={index}
                    className={`flex flex-col border-r h-full transition-all duration-300 relative group ${
                        model.enable !== false ? 'min-w-[320px] flex-1' : 'min-w-[80px] w-[80px]'
                    } bg-card`}>

                    {/* Sticky Header */}
                    <div className={`grid w-full items-center p-3 border-b absolute top-0 left-0 right-0 h-16 bg-background z-40 ${
                        model.enable !== false ? 'grid-cols-[24px_1fr_40px] gap-2' : 'flex flex-col justify-center gap-4'
                    }`}>
                        <div className="flex justify-center shrink-0">
                            <Image src={model.icon} alt={model.model} width={22} height={22} className="object-contain" />
                        </div>

                        {model.enable !== false && (
                            <div className="min-w-0">
                                <Select
                                    value={aiSelectedModels[model.model]?.modelId}
                                    onValueChange={(v) => handleSubModelChange(model.model, v)}
                                    disabled={model.premium}
                                >
                                    <SelectTrigger className="w-full h-8 text-xs focus:ring-0 truncate border-none hover:bg-secondary/50">
                                        <SelectValue placeholder="Select Model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {model.subModel.map((sub, i) => (
                                            <SelectItem key={i} value={sub.id} className="text-xs" disabled={sub.premium}>
                                                <div className="flex items-center justify-between w-full gap-2">
                                                    <span className="truncate">{sub.name}</span>
                                                    {sub.premium && <Lock className="h-3 w-3 text-orange-500 shrink-0" />}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className='flex items-center justify-center shrink-0 z-50'>
                            {model.enable !== false ? (
                                <Switch
                                    checked={model.enable ?? true}
                                    onCheckedChange={(v) => onToggleChange(model.model, v)}
                                    className="scale-75 data-[state=checked]:bg-primary"
                                />
                            ) : (
                                <MessageSquare
                                    className="h-6 w-6 cursor-pointer text-blue-500 hover:scale-110 transition-transform"
                                    onClick={() => onToggleChange(model.model, true)}
                                />
                            )}
                        </div>
                    </div>

                    {/* Messages Area with Markdown Rendering */}
                    <div className="flex-1 overflow-y-auto p-4 pt-20 pb-40 space-y-4 relative scroll-smooth scrollbar-none group-hover:scrollbar-thin">
                        {model.enable !== false ? (
                            <div className="flex flex-col gap-4">
                                {messages[model.model]?.map((m, i) => (
                                    <div key={i}
                                        className={`p-3 rounded-xl text-sm max-w-[95%] shadow-sm ${
                                            m.role === 'user'
                                                ? "bg-orange-50 text-orange-900 ml-auto border border-orange-100"
                                                : "bg-background text-foreground border prose prose-sm max-w-none"
                                        }`}>
                                        {m.role === "assistant" && (
                                            <p className='text-[10px] font-bold opacity-40 mb-1 uppercase tracking-tighter'>
                                                {m.model ?? model.model}
                                            </p>
                                        )}
                                        <div className={`leading-relaxed ${m.loading ? "animate-pulse" : ""}`}>
                                            <ReactMarkdown >
                                                {m.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ))}

                                {/* Premium Lock */}
                                {(model.premium || model.subModel.find(s => s.id === aiSelectedModels[model.model]?.modelId)?.premium) && (
                                    <div className='absolute inset-0 bg-background/40 backdrop-blur-[3px] flex items-center justify-center z-20 pt-16'>
                                        <Button className="rounded-full shadow-2xl gap-2 font-semibold">
                                            <Lock className='h-4 w-4' />
                                            Upgrade Plan
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full opacity-10 italic">
                                <MessageSquare className="h-12 w-12 mb-2" />
                                <p className="text-sm">Model View Disabled</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AiMultiModels;