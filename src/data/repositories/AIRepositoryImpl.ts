import { AIQuery } from "@/domain/entities/AIQuery";
import { AIRepository } from "@/domain/repositories/AiRepository";
import { injectable } from "tsyringe";
import { aiEndpoints } from "../aiApi/endpoints/aiEndpoints";
import { AIQueryMapper } from "../mappers/AIQueryMapper";

@injectable()
export class AIRepositoryImpl implements AIRepository {
    async getAiQuery(query: string): Promise<AIQuery> {
        const response = await aiEndpoints.aiRequest(query); 
        return AIQueryMapper.toDomain(response);
    }

    async getAiQueryStream(
    query: string, 
    onToken: (token: string) => void, 
    onComplete: (fullResponse: string) => void, 
    onError: (error: string) => void
  ): Promise<void> {
    const response = await aiEndpoints.aiRequestStream(query, onToken, onComplete, onError);
    console.log(`From repository: ${response}`);
    return response;
  }
}