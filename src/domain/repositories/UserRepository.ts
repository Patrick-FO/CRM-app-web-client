export interface UserRepository {
    createUser(
        username: string, 
        password: string
    ): Promise<boolean>; 

    loginUser(
        username: string, 
        password: string
    ): Promise<boolean>; 
}