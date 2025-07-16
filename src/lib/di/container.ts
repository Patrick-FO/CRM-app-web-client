import 'reflect-metadata'; 
import { container } from 'tsyringe'; 

export const TOKENS = {
    //Repositories
    UserRepository: 'UserRepository', 
    ContactRepository: 'ContactRepository', 
    NoteRepository: 'NoteRepository',

    //User use cases
    LoginUserUseCase: 'LoginUserUseCase', 
    RegisterUserUseCase: 'RegisterUserUseCase', 
    LogoutUserUseCase: 'LogoutUserUseCase', 

    //Contact use cases
    GetAllContactsUseCase: 'GetAllContactsUseCase', 
    GetContactByIdUseCase: 'GetContactByIdUseCase', 
    CreateContactUseCase: 'CreateContactUseCase', 
    EditContactUseCase: 'EditContactUseCase', 
    DeleteContactUseCase: 'DeleteContactUseCase',

    //Note use cases
    GetNotesForContactUseCase: 'GetNotesForContactUseCase', 
    GetNoteByIdUseCase: 'GetNoteByIdUseCase', 
    CreateNoteUseCase: 'CreateNoteUseCase', 
    EditNoteUseCase: 'EditNoteUseCase', 
    DeleteNoteUseCase: 'DeleteNoteUseCase'
} as const; 

export { container }; 