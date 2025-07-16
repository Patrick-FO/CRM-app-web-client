import { Note } from '../../domain/entities/Note'; 
import { NoteResponse } from '../api/dtos/responses/NoteResponse'; 

export class NoteMapper {
    static toDomain(dto: NoteResponse): Note {
        return {
            id: dto.id, 
            userId: dto.userId,
            contactIds: dto.contactIds,
            title: dto.title,
            description: dto.description
        }; 
    }

    static toDomainList(dtos: NoteResponse[]): Note[] {
        return dtos.map(dto => this.toDomain(dto))
    }
}