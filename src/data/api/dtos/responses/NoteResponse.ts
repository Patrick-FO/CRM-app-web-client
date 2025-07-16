export interface NoteResponse {
    id: number; 
    userId: string; 
    contactIds: number[]; 
    title: string; 
    description?: string; 
}