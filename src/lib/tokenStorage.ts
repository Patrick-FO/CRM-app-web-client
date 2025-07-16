const TOKEN_KEY = 'authToken'; 

export const tokenStorage = {
    set(token: string): void {
        sessionStorage.setItem(TOKEN_KEY, token); 
    }, 

    get(): string | null {
        return sessionStorage.getItem(TOKEN_KEY); 
    }, 

    remove(): void {
        sessionStorage.removeItem(TOKEN_KEY);
    }, 

    exists(): boolean {
        return sessionStorage.getItem(TOKEN_KEY) != null; 
    },
};
