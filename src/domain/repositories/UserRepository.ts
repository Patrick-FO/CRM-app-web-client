export interface UserRepository {
    createUser(
        username: string, 
        password: string
    ): Promise<boolean>; 

    loginUser(
        username: string, 
        password: string
    ): Promise<{ token: string, userId: string }>; 
}