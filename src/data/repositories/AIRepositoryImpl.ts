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
}