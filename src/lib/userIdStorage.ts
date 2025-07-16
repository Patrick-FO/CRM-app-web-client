const USER_ID_KEY = 'userId'; 

export const userIdStorage = {
    set(userId: string): void {
        sessionStorage.setItem(USER_ID_KEY, userId); 
    }, 

    get(): string | null {
        return sessionStorage.getItem(USER_ID_KEY); 
    }, 

    remove(): void {
        sessionStorage.removeItem(USER_ID_KEY);
    }, 

    exists(): boolean {
        return sessionStorage.getItem(USER_ID_KEY) != null; 
    },
}; 