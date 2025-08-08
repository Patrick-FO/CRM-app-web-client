import { useState, useRef, useCallback, useEffect } from "react";
import { TOKENS, container } from "@/lib/di/container";
import { Message } from "@/domain/entities/Message";
import { GetAIQueryUseCase, GetAIQueryStreamUseCase } from "@/domain/usecases/interfaces/AIUseCases";

export function useAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const currentStreamingId = useRef<string | null>(null);
  const streamingContent = useRef<string>('');

  // Debug: Log every state change
  console.log('🔍 Hook state - Messages count:', messages.length, 'Loading:', loading);

  // Debug effect to track message updates
  useEffect(() => {
    console.log('🎨 Messages state updated:', messages.map(m => ({
      id: m.id,
      type: m.type,
      contentLength: m.content.length,
      preview: m.content.slice(0, 50) + (m.content.length > 50 ? '...' : '')
    })));
  }, [messages]);

  const sendPrompt = useCallback(async (prompt: string) => {
    if (!prompt.trim() || loading) return;

    console.log('🚀 Starting AI request with prompt:', prompt);
    
    // Prevent multiple calls by checking if we're already processing
    if (currentStreamingId.current) {
      console.log('⚠️ Already processing a request, ignoring');
      return;
    }
    
    setLoading(true);
    setError('');

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: prompt,
      timestamp: new Date()
    };
    
    console.log('👤 Adding user message:', userMessage);
    setMessages(prev => {
      const updated = [...prev, userMessage];
      console.log('👤 Messages after user:', updated);
      return updated;
    });

    // Create placeholder AI message for streaming
    const aiMessageId = (Date.now() + 1).toString();
    currentStreamingId.current = aiMessageId;
    
    // IMPORTANT: Reset the accumulator
    streamingContent.current = '';
    
    const initialAiMessage: Message = {
      id: aiMessageId,
      type: 'ai',
      content: '',
      timestamp: new Date()
    };
    
    console.log('🤖 Adding placeholder AI message:', initialAiMessage);
    setMessages(prev => {
      // Check if we already have this message ID to prevent duplicates
      const exists = prev.some(msg => msg.id === aiMessageId);
      if (exists) {
        console.log('⚠️ Message already exists, not adding duplicate');
        return prev;
      }
      
      const updated = [...prev, initialAiMessage];
      console.log('🤖 Messages after placeholder:', updated);
      return updated;
    });

    try {
      const getAIQueryStreamUseCase = container.resolve<GetAIQueryStreamUseCase>(TOKENS.GetAIQueryStreamUseCase);
      
      console.log('📡 Calling streaming use case...');
      
      await getAIQueryStreamUseCase.execute(
        prompt,
        // onToken - accumulate in ref, then update state
        (token: string) => {
          console.log('🔤 TOKEN CALLBACK FIRED! Token:', JSON.stringify(token));
          
          if (currentStreamingId.current === aiMessageId) {
            // Accumulate in the ref
            streamingContent.current += token;
            console.log('🔤 Accumulated content length:', streamingContent.current.length);
            console.log('🔤 Current content preview:', streamingContent.current.slice(0, 100) + '...');
            
            // Update state with accumulated content
            setMessages(prev => {
              return prev.map(msg => 
                msg.id === aiMessageId 
                  ? { ...msg, content: streamingContent.current }
                  : msg
              );
            });
          } else {
            console.log('⚠️ Token callback fired but ID mismatch');
          }
        },
        // onComplete - finalize the message
        (fullResponse: string) => {
          console.log('✅ COMPLETE CALLBACK FIRED! Full response length:', fullResponse.length);
          console.log('✅ Full response preview:', fullResponse.slice(0, 100) + '...');
          
          if (currentStreamingId.current === aiMessageId) {
            console.log('✅ Finalizing message with full response');
            setMessages(prev => {
              const updated = prev.map(msg => 
                msg.id === aiMessageId 
                  ? { ...msg, content: fullResponse }
                  : msg
              );
              console.log('✅ Final messages:', updated);
              return updated;
            });
            currentStreamingId.current = null;
            streamingContent.current = '';
            setLoading(false);
            console.log('✅ Loading set to false');
          }
        },
        // onError - handle errors
        (errorMessage: string) => {
          console.error('❌ ERROR CALLBACK FIRED!', errorMessage);
          
          if (currentStreamingId.current === aiMessageId) {
            setError(errorMessage);
            
            // Remove the placeholder AI message and add error message
            setMessages(prev => {
              const filtered = prev.filter(msg => msg.id !== aiMessageId);
              const errorMsg: Message = {
                id: (Date.now() + 2).toString(),
                type: 'error',
                content: `Error: ${errorMessage}`,
                timestamp: new Date()
              };
              const updated = [...filtered, errorMsg];
              console.log('❌ Messages after error:', updated);
              return updated;
            });
            
            currentStreamingId.current = null;
            streamingContent.current = '';
            setLoading(false);
          }
        }
      );
      
      console.log('📡 Use case execute completed');
      
    } catch (err) {
      console.error('💥 Unexpected error in hook:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      
      if (currentStreamingId.current === aiMessageId) {
        // Remove placeholder and add error in one state update
        setMessages(prev => {
          const filtered = prev.filter(msg => msg.id !== aiMessageId);
          const errorMsg: Message = {
            id: (Date.now() + 2).toString(),
            type: 'error',
            content: `Error: ${errorMessage}`,
            timestamp: new Date()
          };
          return [...filtered, errorMsg];
        });
        
        currentStreamingId.current = null;
        streamingContent.current = '';
        setLoading(false);
      }
    }
  }, [loading]);

  const clearMessages = useCallback(() => {
    console.log('🧹 Clearing messages');
    setMessages([]);
    setError('');
    currentStreamingId.current = null;
    streamingContent.current = '';
  }, []);

  return {
    messages,
    loading,
    error,
    sendPrompt,
    clearMessages
  };
}