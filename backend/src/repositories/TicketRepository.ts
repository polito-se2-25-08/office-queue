import { Ticket } from '../models/Ticket.js';
import { supabase } from '../lib/supabase.js';

export interface ITicketRepository {
  create(ticket: Ticket): Promise<Ticket>;
  findById(id: number): Promise<Ticket | null>;
  getNextnumber(queueId?: number): Promise<number>;
}

export class TicketRepository implements ITicketRepository {
  // Create a ticket row in Supabase
  async create(ticket: Ticket): Promise<Ticket> {
    const insertData: any = {
      service_id: ticket.service_id,
      number: ticket.number,
      collected_at: ticket.collectedAt?.toISOString?.() ?? ticket.collectedAt,
    };
    
    // Only include ticket_id if it exists
    if (ticket.ticket_id) {
      insertData.ticket_id = ticket.ticket_id;
    }
    
    console.log('Inserting into DB:', insertData);
    
    const { data, error } = await supabase
      .from('ticket')
      .insert(insertData)
      .select('*')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return data;
  }

  // Fetch a ticket by id
  async findById(id: number): Promise<Ticket | null> {
    const { data, error } = await supabase
      .from('ticket')
      .select('ticket_id, number, service_id, collected_at')
      .eq('service_id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      ticket_id: data.ticket_id,
      number: data.number,
      service_id: data.service_id,
      //queueId: data.queue_id,
      collectedAt: new Date(data.collected_at),
    };
  }

  // Generate the next ticket number
  async getNextnumber(): Promise<number> {
    let query = supabase
      .from('ticket')
      .select('number', { head: false, count: 'exact' }) 
      .order('number', { ascending: false })
      .limit(1);

    const { data, error } = await query;
    if (error) throw error;

    const max = data && data.length > 0 ? data[0].number ?? 0 : 0;
    return (max || 0) + 1;

  }
}