import { AIQuery } from "../entities/AIQuery";

export interface AIRepository {
    getAiQuery(query: string): Promise<AIQuery>; 
}