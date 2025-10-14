
import { Request, Response, NextFunction } from 'express';
import { TicketService } from '../services/TicketService.js';
import { CreateTicketRequestDTO } from '../dto/ticket.dto.js';

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
        data: services
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
      console.log('🎫 createTicket called');
      console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
      const { service_id }: CreateTicketRequestDTO = req.body;

      // Validation
      if (!service_id) {
        res.status(400).json({
          success: false,
          error: 'service_id is required'
        });
        return;
      }

      const ticket = await this.ticketService.createTicket(service_id);

      res.status(201).json({
        success: true,
        data: ticket,
        message: 'Ticket created successfully'
      });
    } catch (error) {
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
      const { ticketId } = req.params;
      const ticket_Id = Number(ticketId);

    if (!Number.isInteger(ticket_Id)) {
      res.status(400).json({ success: false, error: 'ticket_id must be an integer' });
      return;
    }
      const ticket = await this.ticketService.getTicketById(ticket_Id);

      res.status(200).json({
        success: true,
        data: ticket
      });
    } catch (error) {
      next(error);
    }
  };
}