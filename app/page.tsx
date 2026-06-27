import Link from "next/link";
import { startStudySessionAction } from "./actions";
import { getApplication } from "../src/presentation/application";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const app = getApplication();
  const artworks = await app.listArtworks();
  const sessions = await app.listStudySessions();

  return (
    <div className="hero">
      <section className="section">
        <div className="section-header">
          <div className="stack">
            <p className="kicker">Artwork study</p>
            <h1>Choose an artwork</h1>
          </div>
          <p className="trace">{artworks.length} seeded artworks</p>
        </div>

        {artworks.length > 0 ? (
          <div className="artwork-grid" data-testid="artwork-picker">
            {artworks.map((artwork) => (
              <article
                className="artwork-card"
                data-testid={`artwork-${artwork.id}`}
                key={artwork.id}
              >
                {artwork.imageUrl ? (
                  <img
                    className="artwork-image artwork-card-image"
                    src={artwork.imageUrl}
                    alt={`${artwork.title} by ${artwork.artist ?? "unknown artist"}`}
                    decoding="async"
                    loading="lazy"
                  />
                ) : (
                  <div className="artwork-image artwork-card-placeholder" aria-hidden="true">
                    Reference only
                  </div>
                )}
                <div className="artwork-card-body">
                  <div className="stack">
                    <h2>{artwork.title}</h2>
                    <p className="meta">
                      {[artwork.artist, artwork.year, artwork.movement]
                        .filter(Boolean)
                        .join(" / ")}
                    </p>
                  </div>
                  <div className="actions">
                    <form action={startStudySessionAction}>
                      <input type="hidden" name="artworkId" value={artwork.id} />
                      <button type="submit">Start study</button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <section className="empty">No artwork has been seeded yet.</section>
        )}
      </section>

      {sessions.length > 0 ? (
        <section className="section">
          <div className="section-header">
            <h2>Study Sessions</h2>
          </div>
          <div className="stack">
            {sessions.map((session) => (
              <Link className="item" href={`/studies/${session.id}`} key={session.id}>
                <strong>{session.artworkId}</strong>
                <p className="trace">
                  Started {formatDate(session.startedAt)}
                  {session.completedAt ? ` / Completed ${formatDate(session.completedAt)}` : ""}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
