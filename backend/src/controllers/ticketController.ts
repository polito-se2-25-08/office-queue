
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
      const { ticket_id } = req.params;
      const ticket_Id = Number(ticket_id);

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
        res.status(400).json({ success: false, error: 'ticket_id must be an integer' });
        return;
      }
      if (!Number.isInteger(desk_Id)) {
        res.status(400).json({ success: false, error: 'desk_id must be an integer' });
        return;
      }
      const ticket = await this.ticketService.callTicket(ticket_Id, desk_Id);

      res.status(200).json({
        success: true,
        data: ticket,
        message: 'Ticket called successfully'
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
        res.status(400).json({ success: false, error: 'ticket_id must be an integer' });
        return;
      }
      const ticket = await this.ticketService.serveTicket(ticket_Id);

      res.status(200).json({
        success: true,
        data: ticket,
        message: 'Ticket served successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}