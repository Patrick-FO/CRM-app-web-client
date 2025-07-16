export interface NoteRequest {
    contactIds: number[]; 
    title: string; 
    description?: string; 
}