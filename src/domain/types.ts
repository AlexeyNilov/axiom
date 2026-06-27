import { DomainError } from "./errors.js";

export type EntityId = string;

export type Clock = () => Date;
export type IdGenerator = () => EntityId;

export function requireNonEmptyText(value: string, fieldName: string): string {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    throw new DomainError(`${fieldName} is required`);
  }

  return trimmed;
}
