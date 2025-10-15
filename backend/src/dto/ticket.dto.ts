// Request: Create a ticket
export interface CreateTicketRequestDTO {
	serviceId: number;
}

// Shared: Ticket shape for responses
export interface TicketDTO {
	ticket_id?: number;
	number: number;
	service_id: number;
	serviceName: string;
	//  queueId: string;
	collectedAt: Date;
	estimatedWaitingTime?: number;
}

// Response: Create Ticket
export interface CreateTicketResponseDTO extends TicketDTO {}

// Response: Get Ticket
export interface GetTicketResponseDTO extends TicketDTO {}

// Service DTO
export interface ServiceDTO {
	service_id: number;
	name: string;
	//averageServiceTime: number;
}
