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

			ticketVector.push(ticket);

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

			res.status(200).json({
				success: true,
				data: ticket,
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
			//the request filter all the tickets in memory that have a specific service (this is a mocked up version in which there's only one desk that does one service)
      //For this case we will filter one specific service (service_id=2) and do the filtering based on that. We then take the ticket with the lowest number 
      //(the one that came first) and we remove it from the in-memory storage.
      //At the end we return the ticket that was called (Probably just number and service are enough).

      //TODO: implement logic and route part




			// const { desk_Id } = req.params;
			// const desk_Id = Number(desk_Id);

			// if (!Number.isInteger(desk_Id)) {
			// 	res.status(400).json({
			// 		success: false,
			// 		error: "desk_Id must be an integer",
			// 	});
			// 	return;
			// }

			// const filteredTickets = ticketVector.filter(
			// 	(ticket) => ticket.service_id === '2'
			// ).sort((a, b) => a.number - b.number);

      // if (filteredTickets.length > 0) { 
      //   counterTicket[0] = filteredTickets[0].number; // Update the current ticket for the desk
      //   ticketVector = ticketVector.filter(ticket => ticket.number !== counterTicket[0]); // Remove the called ticket from the in-memory storage
      //   res.status(200).json({
			// 	success: true,
			// 	data: { currentTicket: counterTicket[0] },
			//   });
      // }

		// 	res.status(200).json({
		// 		success: true,
		// 		data: filteredTickets,
			// });
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
}
