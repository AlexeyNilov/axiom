import { EntityId, requireNonEmptyText } from "./types";

export type ArtworkProps = {
  id: EntityId;
  title: string;
  artist?: string;
  year?: string;
  movement?: string;
  imageUrl?: string;
  imagePageUrl?: string;
  sourceUrl?: string;
};

export class Artwork {
  private constructor(
    readonly id: EntityId,
    readonly title: string,
    readonly artist?: string,
    readonly year?: string,
    readonly movement?: string,
    readonly imageUrl?: string,
    readonly imagePageUrl?: string,
    readonly sourceUrl?: string,
  ) {}

  static create(props: ArtworkProps): Artwork {
    return new Artwork(
      requireNonEmptyText(props.id, "Artwork id"),
      requireNonEmptyText(props.title, "Artwork title"),
      props.artist?.trim(),
      props.year?.trim(),
      props.movement?.trim(),
      props.imageUrl?.trim(),
      props.imagePageUrl?.trim(),
      props.sourceUrl?.trim(),
    );
  }
}
