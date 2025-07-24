export interface Message {
    id: string, 
    type: 'user' | 'ai' | 'error',
    content: string, 
    timestamp: Date, 
    isStreaming?: boolean
}