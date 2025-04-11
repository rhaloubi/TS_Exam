import { Resource } from '../models/Resource';

export class ResourceManager {
    private static instance: ResourceManager;
    private resources: Map<string, Resource> = new Map();

    private constructor() {}

    static getInstance(): ResourceManager {
        if (!ResourceManager.instance) {
            ResourceManager.instance = new ResourceManager();
        }
        return ResourceManager.instance;
    }

    addResource(resource: Resource): void {
        this.resources.set(resource.id, resource);
    }

    getResource(id: string): Resource | undefined {
        return this.resources.get(id);
    }

    getAllResources(): Resource[] {
        return Array.from(this.resources.values());
    }

    allocateResource(id: string): void {
        const resource = this.resources.get(id);
        if (resource) {
            resource.allocate();
        }
    }

    releaseResource(id: string): void {
        const resource = this.resources.get(id);
        if (resource) {
            resource.release();
        }
    }
}