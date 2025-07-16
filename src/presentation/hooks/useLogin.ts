import { useState } from "react";
import { container, TOKENS } from "@/lib/di/container";
import type { LoginUserUseCase } from "@/domain/usecases/interfaces/UserUseCases";

export function useLogin() {
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState('');

    const login = async (username: string, password: string): Promise<boolean> => {
        setLoading(true); 
        setError(''); 

        try {
            console.log('Attempting to resolve LoginUserUseCase');
            console.log('Available tokens:', Object.keys(container));

            const loginUseCase = container.resolve<LoginUserUseCase>(TOKENS.LoginUserUseCase); 
            const success = await loginUseCase.execute(username, password); 
            return success; 
        } catch(err) {
            console.error('DI resolution error:', err); 
            setError(err instanceof Error ? err.message : 'Login failed'); 
            return false; 
        } finally {
            setLoading(false); 
        }
    };

    const clearError = () => setError('');

    return {
        login, 
        loading, 
        error, 
        clearError
    };
}