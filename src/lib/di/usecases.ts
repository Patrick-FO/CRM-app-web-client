import { container, TOKENS } from './container'; 
import { LoginUserUseCase, RegisterUserUseCase, LogoutUserUseCase } from '@/domain/usecases/interfaces/UserUseCases';
import { LoginUserUseCaseImpl, RegisterUserUseCaseImpl, LogoutUserUseCaseImpl } from '@/domain/usecases/implementations/UserUseCasesImpl';
import { CreateContactUseCase, DeleteContactUseCase, EditContactUseCase, GetAllContactsUseCase, GetContactByIdUseCase } from '@/domain/usecases/interfaces/ContactUseCases';
import { CreateContactUseCaseImpl, DeleteContactUseCaseImpl, EditContactUseCaseImpl, GetAllContactsUseCaseImpl, GetContactByIdUseCaseImpl } from '@/domain/usecases/implementations/ContactUseCasesImpl';
import { CreateNoteUseCase, DeleteNoteUseCase, EditNoteUseCase, GetNoteByIdUseCase, GetNotesForContactUseCase } from '@/domain/usecases/interfaces/NoteUseCases';
import { CreateNoteUseCaseImpl, DeleteNoteUseCaseImpl, EditNoteUseCaseImpl, GetNoteByIdUseCaseImpl, GetNotesForContactUseCaseImpl } from '@/domain/usecases/implementations/NoteUseCasesImpl';
import { GetAIQueryUseCase } from '@/domain/usecases/interfaces/AIUseCases';
import { GetAIQueryUseCaseImpl } from '@/domain/usecases/implementations/AIUseCasesImpl';

export function setupUseCases() {
    //User use cases
    console.log('Setting up use cases...');
    container.register<LoginUserUseCase>(TOKENS.LoginUserUseCase, {
        useClass: LoginUserUseCaseImpl
    }); 

    console.log('LoginUserUseCase registered');

    container.register<RegisterUserUseCase>(TOKENS.RegisterUserUseCase, {
        useClass: RegisterUserUseCaseImpl
    }); 

    container.register<LogoutUserUseCase>(TOKENS.LogoutUserUseCase, {
        useClass: LogoutUserUseCaseImpl
    });

    //Contact use cases
    container.register<GetAllContactsUseCase>(TOKENS.GetAllContactsUseCase, {
        useClass: GetAllContactsUseCaseImpl
    }); 

    container.register<GetContactByIdUseCase>(TOKENS.GetContactByIdUseCase, {
        useClass: GetContactByIdUseCaseImpl
    }); 

    container.register<CreateContactUseCase>(TOKENS.CreateContactUseCase, {
        useClass: CreateContactUseCaseImpl
    }); 

    container.register<EditContactUseCase>(TOKENS.EditContactUseCase, {
        useClass: EditContactUseCaseImpl
    }); 

    container.register<DeleteContactUseCase>(TOKENS.DeleteContactUseCase, {
        useClass: DeleteContactUseCaseImpl
    }); 

    //Note use cases
    container.register<GetNotesForContactUseCase>(TOKENS.GetNotesForContactUseCase, {
        useClass: GetNotesForContactUseCaseImpl
    }); 

    container.register<GetNoteByIdUseCase>(TOKENS.GetNoteByIdUseCase, {
        useClass: GetNoteByIdUseCaseImpl
    }); 

    container.register<CreateNoteUseCase>(TOKENS.CreateNoteUseCase, {
        useClass: CreateNoteUseCaseImpl
    }); 

    container.register<EditNoteUseCase>(TOKENS.EditNoteUseCase, {
        useClass: EditNoteUseCaseImpl
    }); 

    container.register<DeleteNoteUseCase>(TOKENS.DeleteNoteUseCase, {
        useClass: DeleteNoteUseCaseImpl
    }); 

    //AI use cases
    container.register<GetAIQueryUseCase>(TOKENS.GetAIQueryUseCase, {
        useClass: GetAIQueryUseCaseImpl
    });
}