import { UserRepository } from '../../domain/repositories/UserRepository'; 
import { userEndpoints } from '../api/endpoints/userEndpoints'; 
import { tokenStorage } from '../../lib/tokenStorage'; 
import { userIdStorage } from '../../lib/userIdStorage';
import { injectable } from 'tsyringe';

@injectable()
export class UserRepositoryImpl implements UserRepository {
    async createUser(username: string, password: string): Promise<boolean> {
        try {
            await userEndpoints.createUser({ username, password }); 
            return true; 
        } catch (error) {
            return false; 
        }
    }

    //Improve error handling? 
    async loginUser(username: string, password: string): Promise<{ token: string, userId: string }> {
        return await userEndpoints.getJwtToken({ username, password });
    }
}