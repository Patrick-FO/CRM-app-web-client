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
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  if (disabled) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <Button
          size="lg"
          className="fixed bottom-6 left-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50">
          <div className="w-96 h-[500px] shadow-xl border border-gray-200 bg-white flex flex-col overflow-hidden rounded-lg">
            {/* Header */}
            <div className="flex flex-row items-center justify-between p-4 bg-gray-50 border-b border-gray-200 text-gray-800 flex-shrink-0 rounded-t-lg">
              <div className="text-lg font-semibold flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Assistant
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearMessages}
                    className="h-8 w-8 p-0 hover:bg-gray-200 text-gray-600"
                    title="Clear messages"
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
            </div>

            {/* Messages Area - Constrained height with proper scrolling */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <Bot className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">Ask me anything about your contacts and notes!</p>
                      <p className="text-xs mt-1">Try: "Who are my contacts at Google?"</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${
                            message.type === 'user'
                              ? 'bg-blue-500'
                              : message.type === 'error'
                              ? 'bg-red-500'
                              : 'bg-gray-600'
                          }`}
                        >
                          <MessageIcon type={message.type} />
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={`flex-1 max-w-[280px] min-w-0 ${
                            message.type === 'user' ? 'text-right' : 'text-left'
                          }`}
                        >
                          <div
                            className={`inline-block px-4 py-2 rounded-2xl text-sm max-w-full ${
                              message.type === 'user'
                                ? 'bg-blue-500 text-white rounded-br-md'
                                : message.type === 'error'
                                ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-md'
                                : 'bg-gray-100 text-gray-800 rounded-bl-md'
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words overflow-wrap-anywhere">{message.content}</p>
                          </div>
                          <div className={`flex items-center gap-2 mt-1 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-xs text-gray-400">
                              {formatTimestamp(message.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Loading indicator */}
                    {loading && (
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="inline-block px-4 py-2 rounded-2xl rounded-bl-md bg-gray-100">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input Area - Fixed at bottom */}
              <div className="border-t p-4 bg-white flex-shrink-0">
                {error && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-700 text-xs break-words">{error}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about your contacts and notes..."
                    disabled={loading}
                    className="flex-1 border-gray-200 focus:border-blue-500"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || loading}
                    size="sm"
                    className="px-3 flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop overlay when chat is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/5 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}