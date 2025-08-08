import { AIQuery } from "@/domain/entities/AIQuery";

export interface GetAIQueryUseCase {
    execute(query: string): Promise<AIQuery>; 
}

export interface GetAIQueryStreamUseCase {
  execute(
    query: string,
    onToken: (token: string) => void,
    onComplete: (fullResponse: string) => void,
    onError: (error: string) => void
  ): Promise<void>;
}