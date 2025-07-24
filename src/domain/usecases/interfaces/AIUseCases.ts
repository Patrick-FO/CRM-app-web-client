import { AIQuery } from "@/domain/entities/AIQuery";

export interface GetAIQueryUseCase {
    execute(query: string): Promise<AIQuery>; 
}