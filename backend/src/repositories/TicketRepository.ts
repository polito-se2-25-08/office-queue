import { Ticket } from "../models/Ticket.js";
import { supabase } from "../lib/supabase.js";

export interface ITicketRepository {
	create(ticket: Ticket): Promise<Ticket>;
	callTicket(ticket_id: number, desk_id: number): Promise<void>;
	serveTicket(ticket_id: number): Promise<void>;
	//removeFromActiveTickets(ticket_id: number): Promise<void>;
	findById(id: number): Promise<Ticket | null>;
	getNextnumber(queueId?: number): Promise<number>;
}

export class TicketRepository implements ITicketRepository {
	// Create a ticket row in Supabase
	async create(ticket: Ticket): Promise<Ticket> {
		const insertData: any = {
			service_id: ticket.service_id,
			number: ticket.number,
			collected_at:
				ticket.collectedAt?.toISOString?.() ?? ticket.collectedAt,
		};

		// Only include ticket_id if it exists
		if (ticket.ticket_id) {
			insertData.ticket_id = ticket.ticket_id;
		}

		console.log("Inserting into DB:", insertData);

		const { data, error } = await supabase
			.from("tickets")
			.insert(insertData)
			.select("*")
			.single();

		if (error) {
			console.error("Supabase error:", error);
			throw error;
		}

		return data;
	}

	async callTicket(ticket_id: number, desk_id: number): Promise<void> {
		const { data, error } = await supabase
			.from("served_tickets")
			.insert({ ticket_id, desk_id });

		if (error) {
			console.error("Supabase error:", error);
			throw error;
		}
	}

	async serveTicket(ticket_id: number): Promise<void> {
		const { data, error } = await supabase
			.from("served_tickets")
			.update({ served_at: new Date().toISOString() })
			.eq("ticket_id", ticket_id);

		if (error) {
			console.error("Supabase error:", error);
			throw error;
		}
	}

	/* FOR NOW COMMENTED OUT BECAUSE SERVED TICKETS HAVE A FK TO TICKETS
  async removeFromActiveTickets(ticket_id: number): Promise<void> {
    const { data, error } = await supabase
      .from('tickets')
      .delete()
      .eq('ticket_id', ticket_id);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  } */

	// Fetch a ticket by id
	async findById(id: number): Promise<Ticket | null> {
		const { data, error } = await supabase
			.from("tickets")
			.select("ticket_id, number, service_id, collected_at")
			.eq("ticket_id", id)
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
			.from("tickets")
			.select("number", { head: false, count: "exact" })
			.order("number", { ascending: false })
			.limit(1);

		const { data, error } = await query;
		if (error) throw error;

		const max = data && data.length > 0 ? data[0].number ?? 0 : 0;
		return (max || 0) + 1;
	}
}
