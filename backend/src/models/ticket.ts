export interface Ticket {
    id: string;
    queueId: string;
    serviceId: string;
    number: number;
    collected_at: Date;
}