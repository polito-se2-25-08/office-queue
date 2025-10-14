// ServiceRepository.ts
import { supabase } from '../lib/supabase.js';
import { Service } from '../models/Service.js';

export interface IServiceRepository {
  findById(id: number): Promise<Service | null>;
  findAll(): Promise<Service[]>;
}

export class ServiceRepository implements IServiceRepository {
  async findById(id: number): Promise<Service | null> {
    const { data, error } = await supabase
      .from('service')
      .select('service_id, name')
      .eq('service_id', id)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const service: Service = {
      service_id: data.service_id,
      name: data.name,
    //  averageServiceTime: 10,
    };

    return service;
  }

  async findAll(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('service')
      .select('service_id, name')
      .order('name', { ascending: true });

    if (error) throw error;

    return (data ?? []).map(row => ({
      service_id: row.service_id,
      name: row.name,
    //  averageServiceTime: 10,
    }));
  }
}