import { container, TOKENS } from '@/lib/di/container';
import type { LogoutUserUseCase } from '@/domain/usecases/interfaces/UserUseCases';

export function useLogout() {
  const logout = () => {
    const useCase = container.resolve<LogoutUserUseCase>(TOKENS.LogoutUserUseCase);
    useCase.execute();
    
    // Redirect to login
    window.location.href = '/login';
  };

  return { logout };
}