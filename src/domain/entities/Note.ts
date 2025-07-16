export interface Note {
    id: number; 
    userId: string; 
    contactIds: number[]; 
    title: string; 
    description?: string; 
}