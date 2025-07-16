import { Contact } from '../../domain/entities/Contact'; 
import { ContactResponse } from '../api/dtos/responses/ContactResponse'; 

export class ContactMapper {
    static toDomain(dto: ContactResponse): Contact {
        return {
            id: dto.id, 
            userId: dto.userId, 
            name: dto.name,
            company: dto.company,
            phoneNumber: dto.phoneNumber,
            contactEmail: dto.contactEmail
        }; 
    }

    static toDomainList(dtos: ContactResponse[]): Contact[] {
        return dtos.map(dto => this.toDomain(dto))
    }
}