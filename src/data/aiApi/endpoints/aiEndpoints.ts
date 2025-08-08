import { AIQueryRequest } from "../dtos/requests/AIQueryRequest";
import { AIQueryResponse } from "../dtos/responses/AIQueryResponse";
import { aiApiClient } from "../client";
import { userIdStorage } from "@/lib/userIdStorage";

export const aiEndpoints = {
    async aiRequest(query: string): Promise<AIQueryResponse> {
        const userId = userIdStorage.get();
        if (!userId) throw new Error('Unable to make AI request due to absent user ID');

        const request: AIQueryRequest = {
            user_id: userId, 
            query: query
        }; 

        const response = await aiApiClient.post('/query', request); 
        return response.data;
    },

    async aiRequestStream(query: string, onToken: (token: string) => void, onComplete: (fullResponse: string) => void, onError: (error: string) => void): Promise<void> {
    const userId = userIdStorage.get();
    if (!userId) {
      console.error('❌ No user ID found');
      onError('Unable to make AI request due to absent user ID');
      return;
    }

    console.log('📡 Starting stream request for user:', userId, 'query:', query);

    try {
      const response = await fetch('http://localhost:8001/ai/query/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          query: query
        })
      });

      console.log('📡 Stream response status:', response.status);

      if (!response.ok) {
        throw new Error(`Stream request failed: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      console.log('📖 Starting to read stream...');

      const decoder = new TextDecoder();
      let buffer = '';
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('📖 Stream reading complete');
          break;
        }
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep the last incomplete line in buffer
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            console.log('📦 Received SSE line:', line);
            try {
              const eventData = JSON.parse(line.slice(6));
              console.log('📦 Parsed event:', eventData);
              
              // Handle direct token format from your Python backend
              if (eventData.token) {
                console.log('🔤 Token found:', eventData.token);
                fullResponse += eventData.token;
                onToken(eventData.token);
                
              // Handle completion with full_response  
              } else if (eventData.full_response) {
                console.log('✅ Full response found:', eventData.full_response);
                onComplete(eventData.full_response);
                return;
                
              // Handle status updates
              } else if (eventData.status) {
                console.log('📊 Status update:', eventData);
                // Just log status, don't do anything else
                
              } else if (eventData.error) {
                console.error('❌ Error event:', eventData.error);
                onError(eventData.error);
                return;
              }
            } catch (parseError) {
              console.warn('⚠️ Failed to parse SSE data:', parseError, 'Line:', line);
            }
          }
        }
      }
    } catch (error) {
      console.error('💥 Stream error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown streaming error';
      onError(errorMessage);
    }
  }
}