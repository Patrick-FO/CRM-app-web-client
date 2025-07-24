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
    }
}