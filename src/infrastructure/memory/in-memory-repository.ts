import { Repository } from "../../application/repositories.js";
import { EntityId } from "../../domain/types.js";

export class InMemoryRepository<T extends { id: EntityId }> implements Repository<T> {
  private readonly records = new Map<EntityId, T>();

  save(entity: T): void {
    this.records.set(entity.id, entity);
  }

  findById(id: EntityId): T | undefined {
    return this.records.get(id);
  }

  list(): T[] {
    return [...this.records.values()];
  }
}
