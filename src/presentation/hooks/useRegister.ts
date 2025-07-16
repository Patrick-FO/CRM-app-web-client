import { useState } from "react";
import { container, TOKENS } from "@/lib/di/container";
import type { RegisterUserUseCase } from "@/domain/usecases/interfaces/UserUseCases";

export function useRegister() {
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState('');

    const register = async (username: string, password: string): Promise<boolean> => {
        setLoading(true); 
        setError('');

        try {
            const registerUseCase = container.resolve<RegisterUserUseCase>(TOKENS.RegisterUserUseCase); 
            const success = await registerUseCase.execute(username, password); 
            return success;
        } catch(err) {
            setError(err instanceof Error ? err.message : 'Registration failed'); 
            return false; 
        } finally {
            setLoading(false); 
        }
    };

    const clearError = () => setError(''); 

    return {
        register, 
        loading, 
        error,
        clearError
    };
}