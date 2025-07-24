import { AIQuery } from "@/domain/entities/AIQuery";
import { AIQueryResponse } from "../aiApi/dtos/responses/AIQueryResponse";

export class AIQueryMapper {
    static toDomain(dto: AIQueryResponse): AIQuery {
        return {
            success: dto.success, 
            response: dto.response, 
            error: dto.error
        };
    }
}