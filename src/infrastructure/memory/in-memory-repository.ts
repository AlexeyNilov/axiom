import { Repository } from "../../application/repositories";
import { EntityId } from "../../domain/types";

export class InMemoryRepository<T extends { id: EntityId }> implements Repository<T> {
  private readonly records = new Map<EntityId, T>();

  async save(entity: T): Promise<void> {
    this.records.set(entity.id, entity);
  }

  async findById(id: EntityId): Promise<T | undefined> {
    return this.records.get(id);
  }

  async list(): Promise<T[]> {
    return [...this.records.values()];
  }
}
