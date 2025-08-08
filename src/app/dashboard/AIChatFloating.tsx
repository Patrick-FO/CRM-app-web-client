import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Trash2, Send, Bot, User, AlertCircle } from 'lucide-react';
import { useAI } from '@/presentation/hooks/useAI';
import { Message } from '@/domain/entities/Message';

interface AIChatFloatingProps {
  disabled?: boolean;
}

export function AIChatFloating({ disabled = false }: AIChatFloatingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { messages, loading, error, sendPrompt, clearMessages } = useAI();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;
    const prompt = inputValue;
    setInputValue('');
    await sendPrompt(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const MessageIcon = ({ type }: { type: Message['type'] }) => {
    switch (type) {
      case 'user':
        return <User className="h-4 w-4" />;
      case 'ai':
        return <Bot className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const LoadingDots = () => (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  );

  if (disabled) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl z-50 bg-black hover:bg-gray-800"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col">
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
            <CardTitle className="text-lg font-semibold">AI Assistant</CardTitle>
            <div className="flex items-center space-x-2">
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearMessages}
                  className="h-8 w-8 p-0 hover:bg-gray-200 text-gray-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 hover:bg-gray-200 text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Messages Area - Constrained height with proper scrolling */}
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
                  <Bot className="h-12 w-12 mb-4 text-gray-300" />
                  <p className="mb-2">Ask me anything about your contacts and notes!</p>
                  <p className="text-sm">Try: "Who are my contacts at Google?"</p>
                </div>
              ) : (
                <div className="space-y-4 px-4 py-2">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      {/* Avatar */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white ${
                        message.type === 'user' ? 'bg-black' : 
                        message.type === 'error' ? 'bg-red-500' : 'bg-gray-600'
                      }`}>
                        <MessageIcon type={message.type} />
                      </div>

                      {/* Message Bubble */}
                      <div className={`flex-1 min-w-0 ${message.type === 'user' ? 'text-right' : ''}`}>
                        <div className={`inline-block max-w-[75%] px-3 py-2 rounded-lg ${
                          message.type === 'user' 
                            ? 'bg-black text-white' 
                            : message.type === 'error'
                            ? 'bg-red-100 text-red-900'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          {/* Show loading dots if message is empty and we're loading, otherwise show content */}
                          {message.content === '' && loading && message.type === 'ai' ? (
                            <LoadingDots />
                          ) : (
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {message.content}
                            </p>
                          )}
                        </div>
                        <p className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                          {formatTimestamp(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>
          </CardContent>

          {/* Input Area - Fixed at bottom */}
          <div className="border-t">
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm p-4 pb-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            <div className="flex gap-2 p-4">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your contacts and notes..."
                disabled={loading}
                className="flex-1 border-gray-200 focus:border-black"
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || loading}
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Backdrop overlay when chat is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}