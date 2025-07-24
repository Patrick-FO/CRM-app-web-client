import { useState, useEffect } from "react";
import { TOKENS, container } from "@/lib/di/container";
import { AIQuery } from "@/domain/entities/AIQuery";
import { Message } from "@/domain/entities/Message";
import { GetAIQueryUseCase } from "@/domain/usecases/interfaces/AIUseCases";

export function useAI() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const sendPrompt = async (prompt: string) => {
        if (!prompt.trim() || loading) return;

        setLoading(true);
        setError('');

        const userMessage: Message = {
            id: Date.now().toString(), 
            type: 'user', 
            content: prompt, 
            timestamp: new Date()
        }; 
        setMessages(prev => [...prev, userMessage]); 

        try {
            const getAIQueryUseCase = container.resolve<GetAIQueryUseCase>(TOKENS.GetAIQueryUseCase); 
            const result = await getAIQueryUseCase.execute(prompt); 

            if(result.success && result.response) {
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(), 
                    type: 'ai', 
                    content: result.response, 
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, aiMessage]); 
            } else {
                throw new Error(result.error || 'AI query failed');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);

            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                type: 'error', 
                content: `Error: ${errorMessage}`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const clearMessages = () => {
        setMessages([]); 
        setError(''); 
    }

    return {
        messages, 
        loading, 
        error, 
        sendPrompt, 
        clearMessages
    }
}