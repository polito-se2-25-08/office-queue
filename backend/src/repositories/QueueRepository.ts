// QueueRepository.ts
import { supabase } from '../lib/supabase.js';
import { Queue } from '../models/Queue.js';

export interface IQueueRepository {
  findByservice_id(service_id: number): Promise<Queue | null>;
}

export class QueueRepository implements IQueueRepository {
  async findByservice_id(service_id: number): Promise<Queue | null> {
    // Fetch the queue row for a given service
    const { data, error } = await supabase
      .from('queue')
      .select('id, service_id, numberOfPeople, estimatedWaitingTime')
      .eq('service_id', service_id)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    // Map DB row (snake_case) to model (camelCase)
    const queue: Queue = {
      id: data.id,
      service_id: data.service_id,
      numberOfPeople: data.numberOfPeople ?? 0,
      estimatedWaitingTime: data.estimatedWaitingTime ?? 0,
    };

    return queue;
  }
}