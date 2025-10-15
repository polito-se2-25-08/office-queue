// QueueRepository.ts
import { supabase } from '../lib/supabase.js';
import { Queue } from '../models/Queue.js';

export interface IQueueRepository {
  findByservice_id(service_id: number): Promise<Queue | null>;
  updateQueue(queueId: number, ticket: any): Promise<void>;
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

  async updateQueue(service_id: number, ticket: any): Promise<void> {
    // Fetch current queue values
    const { data, error: fetchError } = await supabase
      .from('queue')
      .select('numberOfPeople, estimatedWaitingTime')
      .eq('service_id', service_id)
      .single();

    if (fetchError) {
      console.error('Error fetching queue:', fetchError);
      throw fetchError;
    }

    const updatedNumberOfPeople = (data?.numberOfPeople ?? 0) + 1;
    const updatedEstimatedWaitingTime = (data?.estimatedWaitingTime ?? 0) + 5; // Each ticket adds 5 minutes

    const { error: updateError } = await supabase
      .from('queue')
      .update({
        numberOfPeople: updatedNumberOfPeople,
        estimatedWaitingTime: updatedEstimatedWaitingTime
      })
      .eq('service_id', service_id);

    if (updateError) {
      console.error('Error updating queue:', updateError);
      throw updateError;
    }
  }
}