import { injectable, inject } from 'tsyringe'; 
import type { UserRepository } from '@/domain/repositories/UserRepository';
import { TOKENS } from '@/lib/di/container';
import { LoginUserUseCase, RegisterUserUseCase, LogoutUserUseCase } from '../interfaces/UserUseCases';
import { tokenStorage } from '@/lib/tokenStorage';
import { userIdStorage } from '@/lib/userIdStorage';

@injectable()
export class LoginUserUseCaseImpl implements LoginUserUseCase {
    constructor(@inject(TOKENS.UserRepository) private userRepository: UserRepository) {}

    async execute(username: string, password: string): Promise<boolean> {
        if(!username || !password) {
            throw new Error('Username and password are required'); 
        }

        return this.userRepository.loginUser(username, password); 
    }
}

@injectable()
export class RegisterUserUseCaseImpl implements RegisterUserUseCase {
    constructor(@inject(TOKENS.UserRepository) private userRepository: UserRepository) {}

    async execute(username: string, password: string): Promise<boolean> {
        if(!username || !password) {
            throw new Error('Both password and username are required'); 
        }

        if(password.length < 6) {
            throw new Error('Password must be at least 6 characters'); 
        }

        const accountCreated = await this.userRepository.createUser(username, password); 

        if(!accountCreated) {
            throw new Error('Failed to create account'); 
        }

        const loginSuccess = await this.userRepository.loginUser(username, password); 

        if(!loginSuccess) {
            throw new Error('Account created but login failed'); 
        }

        return true; 
    }
}

@injectable()
export class LogoutUserUseCaseImpl implements LogoutUserUseCase {
    execute(): void {
        tokenStorage.remove(); 
        userIdStorage.remove();
    }
}