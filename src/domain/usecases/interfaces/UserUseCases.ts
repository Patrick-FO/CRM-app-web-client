export interface LoginUserUseCase {
    execute(username: string, password: string): Promise<boolean>; 
}

export interface RegisterUserUseCase {
    execute(username: string, password: string): Promise<boolean>; 
}

export interface LogoutUserUseCase {
    execute(): void; 
}