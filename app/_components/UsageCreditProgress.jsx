import { Progress } from "@/components/ui/progress"
import React from 'react'

function UsageCreditProgress({ remainingToken = 0 }) {
    // Calculate percentage: (Used / Total) * 100
    // If you have 5 total messages:
    const totalMessages = 5;
    const usedMessages = totalMessages - remainingToken;
    const progressValue = (usedMessages / totalMessages) * 100;

    return (
        <div className="p-3 border rounded-2xl mb-5 flex flex-col gap-2">
            <h2 className="font-bold text-xl">Free Plan</h2>
            <p className="text-gray-400">{usedMessages}/{totalMessages} message Used</p>
            <Progress value={progressValue} />
        </div>
    )
}

export default UsageCreditProgress