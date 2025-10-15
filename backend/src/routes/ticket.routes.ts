
import { Router } from 'express';
import { TicketController } from '../controllers/ticketController.js';
import { TicketService } from '../services/TicketService.js';
import { TicketRepository } from '../repositories/TicketRepository.js';
import { ServiceRepository } from '../repositories/ServiceRepository.js';
import { QueueRepository } from '../repositories/QueueRepository.js';

const router = Router();

// Initialize repositories
const ticketRepo = new TicketRepository();
const serviceRepo = new ServiceRepository(); //PLACEHOLDER
const queueRepo = new QueueRepository(); // PLACEHOLDER

// Initialize service
const ticketService = new TicketService(
  ticketRepo,
  serviceRepo,
  queueRepo
);

// Initialize controller
const ticketController = new TicketController(ticketService);

// Routes for "Get Ticket" story
router.get('/services', ticketController.getAvailableServices);
router.post('/tickets', ticketController.createTicket);
router.get('/tickets/:ticket_id', ticketController.getTicket);
router.get('/tickets/:ticket_id/call/:desk_id', ticketController.callTicket);
router.get('/tickets/:ticket_id/serve', ticketController.serveTicket);

export default router;