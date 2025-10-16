import { Request, Response, NextFunction } from "express";
import { TicketService } from "../services/TicketService.js";
import { CreateTicketRequestDTO } from "../dto/ticket.dto.js";

let ticketVector: any[] = []; // In-memory storage for tickets, should use Ticket interface
let counterTicket: number[] = []; // In-memory storage for the current ticket by the desk

export class TicketController {
	constructor(private ticketService: TicketService) {}

	/**
	 * GET /api/services
	 * Get all available services for ticket selection
	 */
	getAvailableServices = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const services = await this.ticketService.getAvailableServices();

			res.status(200).json({
				success: true,
				data: services,
			});
		} catch (error) {
			next(error);
		}
	};

	/**
	 * POST /api/tickets
	 * Create a new ticket for selected service
	 */
	createTicket = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			console.log("🎫 createTicket called");
			console.log("Request body:", req.body);
			console.log("Request headers:", req.headers);
			const { serviceId }: CreateTicketRequestDTO = req.body;

			console.log("serviceId:", serviceId);

			if (!serviceId) {
				res.status(400).json({
					success: false,
					error: "serviceId is required",
				});
				return;
			}

			const ticket = await this.ticketService.createTicket(serviceId);

			// Add the ticket to in-memory storage with status
			const ticketWithStatus = {
				...ticket,
				status: 'pending',
				desk_id: null
			};
			
			ticketVector.push(ticketWithStatus);

			console.log("Created ticket:", ticket);

			res.status(201).json({
				success: true,
				data: ticket,
				message: "Ticket created successfully",
			});
		} catch (error) {
			console.error("Error creating ticket:", error);
			next(error);
		}
	};

	/**
	 * GET /api/tickets/:ticketId
	 * Get ticket details
	 */
	getTicket = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const { ticket_id } = req.params;
			const ticket_Id = Number(ticket_id);

			if (!Number.isInteger(ticket_Id)) {
				res.status(400).json({
					success: false,
					error: "ticket_id must be an integer",
				});
				return;
			}
			const ticket = await this.ticketService.getTicketById(ticket_Id);
			
			// Also check in-memory ticketVector for real-time status
			const memoryTicket = ticketVector.find(t => t.number === ticket_Id);
			
			// Merge database data with memory data for real-time status
			const enhancedTicket = {
				...ticket,
				status: memoryTicket?.status || 'pending',
				desk_id: memoryTicket?.desk_id || null
			};

			res.status(200).json({
				success: true,
				data: enhancedTicket,
			});
		} catch (error) {
			next(error);
		}
	};

	callNext = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const { desk_id } = req.params;
			const desk_Id = Number(desk_id);

			if (!Number.isInteger(desk_Id)) {
				res.status(400).json({
					success: false,
					error: "desk_id must be an integer",
				});
				return;
			}

			// Get all pending tickets for services this desk can handle
			// For now, desk 1 can handle all services (you can make this configurable later)
			const filteredTickets = ticketVector.filter(
				(ticket) => ticket.status === 'pending'
			).sort((a, b) => a.number - b.number);

			if (filteredTickets.length > 0) { 
				const nextTicket = filteredTickets[0];
				
				// Update the current ticket for the desk
				counterTicket[desk_Id - 1] = nextTicket.number;
				
				// Update ticket status to 'called'
				const ticketIndex = ticketVector.findIndex(t => t.number === nextTicket.number);
				if (ticketIndex !== -1) {
					ticketVector[ticketIndex].status = 'called';
					ticketVector[ticketIndex].desk_id = desk_Id;
				}
				
				res.status(200).json({
					success: true,
					data: { 
						ticket: nextTicket,
						currentTicket: nextTicket.number,
						desk_id: desk_Id 
					},
					message: `Ticket ${nextTicket.number} called to desk ${desk_Id}`
				});
			} else {
				res.status(200).json({
					success: true,
					data: null,
					message: "No tickets waiting in queue"
				});
			}
		} catch (error) {
			next(error);
		}
	};

  checkCurrentTicket = (ticket_id: number) => {
    //in the real implementation it should check all the desks (for now we have one). If the ticket is in the 
    //counterTicket vector it means that it is being served, so we can return the desk number, otherwise we return null
    if(counterTicket[0] === ticket_id) {
      return { desk: 1 };
    }
    return null;
    //TODO: add the route and fix the implementation part of the vector (to use the ticket interface)
  };

	callTicket = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const { ticket_id, desk_id } = req.params;
			const ticket_Id = Number(ticket_id);
			const desk_Id = Number(desk_id);

			if (!Number.isInteger(ticket_Id)) {
				res.status(400).json({
					success: false,
					error: "ticket_id must be an integer",
				});
				return;
			}
			if (!Number.isInteger(desk_Id)) {
				res.status(400).json({
					success: false,
					error: "desk_id must be an integer",
				});
				return;
			}
			const ticket = await this.ticketService.callTicket(
				ticket_Id,
				desk_Id
			);

			res.status(200).json({
				success: true,
				data: ticket,
				message: "Ticket called successfully",
			});
		} catch (error) {
			next(error);
		}
	};

	serveTicket = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const { ticket_id } = req.params;
			const ticket_Id = Number(ticket_id);

			if (!Number.isInteger(ticket_Id)) {
				res.status(400).json({
					success: false,
					error: "ticket_id must be an integer",
				});
				return;
			}
			const ticket = await this.ticketService.serveTicket(ticket_Id);

			res.status(200).json({
				success: true,
				data: ticket,
				message: "Ticket served successfully",
			});
		} catch (error) {
			next(error);
		}
	};

	/**
	 * GET /api/queue/status
	 * Get current queue status for all services
	 */
	getQueueStatus = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			// Group tickets by service_id and count pending ones
			const queueStatus = ticketVector
				.filter(ticket => ticket.status === 'pending')
				.reduce((acc, ticket) => {
					if (!acc[ticket.service_id]) {
						acc[ticket.service_id] = {
							service_id: ticket.service_id,
							waiting_count: 0,
							service_name: this.getServiceName(ticket.service_id)
						};
					}
					acc[ticket.service_id].waiting_count++;
					return acc;
				}, {} as Record<number, any>);

			const result = Object.values(queueStatus);

			res.status(200).json({
				success: true,
				data: result
			});
		} catch (error) {
			next(error);
		}
	};

	/**
	 * GET /api/desk/:desk_id/current
	 * Get current ticket being served at a desk
	 */
	getCurrentServing = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const { desk_id } = req.params;
			const desk_Id = Number(desk_id);

			if (!Number.isInteger(desk_Id)) {
				res.status(400).json({
					success: false,
					error: "desk_id must be an integer",
				});
				return;
			}

			const currentTicketNumber = counterTicket[desk_Id - 1];
			
			if (currentTicketNumber) {
				const currentTicket = ticketVector.find(t => t.number === currentTicketNumber);
				
				res.status(200).json({
					success: true,
					data: {
						ticket: currentTicket,
						desk_id: desk_Id,
						service_name: currentTicket ? this.getServiceName(currentTicket.service_id) : null
					}
				});
			} else {
				res.status(200).json({
					success: true,
					data: null,
					message: "No ticket currently being served"
				});
			}
		} catch (error) {
			next(error);
		}
	};

	/**
	 * POST /api/desk/:desk_id/complete
	 * Mark current ticket as completed
	 */
	completeCurrentTicket = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const { desk_id } = req.params;
			const desk_Id = Number(desk_id);

			if (!Number.isInteger(desk_Id)) {
				res.status(400).json({
					success: false,
					error: "desk_id must be an integer",
				});
				return;
			}

			const currentTicketNumber = counterTicket[desk_Id - 1];
			
			if (currentTicketNumber) {
				// Find and update ticket status
				const ticketIndex = ticketVector.findIndex(t => t.number === currentTicketNumber);
				if (ticketIndex !== -1) {
					ticketVector[ticketIndex].status = 'completed';
				}
				
				// Clear the counter
				counterTicket[desk_Id - 1] = 0;
				
				res.status(200).json({
					success: true,
					data: {
						completed_ticket: currentTicketNumber,
						desk_id: desk_Id
					},
					message: `Ticket ${currentTicketNumber} completed at desk ${desk_Id}`
				});
			} else {
				res.status(400).json({
					success: false,
					error: "No ticket currently being served at this desk"
				});
			}
		} catch (error) {
			next(error);
		}
	};

	// Helper method to get service name by ID
	private getServiceName(service_id: number): string {
		const serviceNames: Record<number, string> = {
			1: "Package Services",
			2: "Financial Services", 
			3: "Document Services"
		};
		return serviceNames[service_id] || "Unknown Service";
	}
}
