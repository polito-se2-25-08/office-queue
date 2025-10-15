import { v4 as uuidv4 } from 'uuid';
import { Ticket } from '../models/Ticket.js';
import { ITicketRepository } from '../repositories/TicketRepository.js';
import { IServiceRepository } from '../repositories/ServiceRepository.js';
import { IQueueRepository } from '../repositories/QueueRepository.js';
import { CreateTicketResponseDTO, GetTicketResponseDTO, ServiceDTO } from '../dto/ticket.dto.js';

export class TicketService {
  constructor(
    private ticketRepo: ITicketRepository,
    private serviceRepo: IServiceRepository,
    private queueRepo: IQueueRepository 
  ) {}

  /**
   * Create a new ticket for a selected service
   */
  async createTicket(service_id: number): Promise<CreateTicketResponseDTO> {
    // 1. Validate service exists
    const service = await this.serviceRepo.findById(service_id);
    if (!service) {
      throw new Error(`Service with id '${service_id}' not found`);
    }

    // 3. Generate unique ticket number
    const number = await this.ticketRepo.getNextnumber();

    // 4. Create ticket
    const ticket: Ticket = {
      //ticket_id: uuidv4(),
      //queueId: queue.id,
      service_id: service_id,
      number: number,
      collectedAt: new Date()
    };

    // Update queue of that service
    await this.queueRepo.updateQueue(service_id, ticket); // For now each service is mapped to a queue

    // Get queue to understand the new estimated waiting time
    const updatedQueue = await this.queueRepo.findByservice_id(service_id);


    // 5. Save ticket
    await this.ticketRepo.create(ticket);

    // 6. Return ticket details
    return {
      ticket_id: ticket.ticket_id,
      number: ticket.number,
      service_id: service.service_id,
      serviceName: service.name,
      estimatedWaitingTime: updatedQueue?.estimatedWaitingTime ?? 5,
      //queueId: queue.id,
      collectedAt: ticket.collectedAt
    };
  }

  /**
   * Get ticket details by ID
   */
  async getTicketById(ticket_id: number): Promise<GetTicketResponseDTO> {
    // 1. Get ticket
    const ticket = await this.ticketRepo.findById(ticket_id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // 2. Get service details
    const service = await this.serviceRepo.findById(ticket.service_id);
    if (!service) {
      throw new Error('Service not found');
    }

    // 3. Return ticket details
    return {
      ticket_id: ticket.ticket_id,
      number: ticket.number,
      service_id: service.service_id,
      serviceName: service.name,
      //queueId: ticket.queueId,
      collectedAt: ticket.collectedAt
    };
  }

  /**
   * Get all available services
   */
  async getAvailableServices(): Promise<ServiceDTO[]> {
    return await this.serviceRepo.findAll();
  }
}