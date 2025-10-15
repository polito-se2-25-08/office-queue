export interface Ticket {
    ticket_id?: number;
    // queueId: string;
    service_id: number;
    number: number;
    collectedAt: Date;
}