import { Resource } from '../models/Resource';

export interface ResourceDAO {
    save(resource: Resource): Promise<void>;
    findById(id: string): Promise<Resource | undefined>;
    findAll(): Promise<Resource[]>;
    update(resource: Resource): Promise<void>;
    delete(id: string): Promise<void>;
}