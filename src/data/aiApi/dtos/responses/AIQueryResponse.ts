export interface AIQueryResponse {
    success: boolean, 
    response?: string,
    error?: string, 
    data_summary?: {
        contacts_count: number, 
        notes_count: number
    }
}