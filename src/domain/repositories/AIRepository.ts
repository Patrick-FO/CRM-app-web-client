import { AIQuery } from "../entities/AIQuery";

export interface AIRepository {
    getAiQuery(query: string): Promise<AIQuery>; 

    getAiQueryStream(
    query: string, 
    onToken: (token: string) => void, 
    onComplete: (fullResponse: string) => void, 
    onError: (error: string) => void
  ): Promise<void>;
}