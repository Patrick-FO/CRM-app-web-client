import { injectable, inject } from "tsyringe";
import { TOKENS } from "@/lib/di/container";
import { GetAIQueryUseCase, GetAIQueryStreamUseCase } from "../interfaces/AIUseCases";
import type { AIRepository } from "@/domain/repositories/AiRepository";
import { AIQuery } from "@/domain/entities/AIQuery";

@injectable()
export class GetAIQueryUseCaseImpl implements GetAIQueryUseCase {
    constructor(@inject(TOKENS.AIRepository) private aiRepository: AIRepository) {}

    async execute(query: string): Promise<AIQuery> {
        if(!query || query.trim().length == 0) throw new Error('Query input cannot be blank');
        return this.aiRepository.getAiQuery(query); 
    }
}

@injectable()
export class GetAIQueryStreamUseCaseImpl implements GetAIQueryStreamUseCase {
  constructor(@inject(TOKENS.AIRepository) private aiRepository: AIRepository) {}

  async execute(
    query: string,
    onToken: (token: string) => void,
    onComplete: (fullResponse: string) => void,
    onError: (error: string) => void
  ): Promise<void> {
    if(!query || query.trim().length == 0) {
      onError('Query input cannot be blank');
      return;
    }
    
    return this.aiRepository.getAiQueryStream(query, onToken, onComplete, onError);
  }
}